import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { getPortalFromPath, getSessionCookieName, hashSessionToken } from "@/lib/auth/session";

const statusOrder = [
  "PENDING",
  "PROCESSING",
  "REPAIR_COMPLETED",
  "DELIVERED",
] as const;

const intakeTypeMap = {
  "Walk-in": "WALK_IN",
  "Courier": "COURIER",
} as const;

type RepairStatus = (typeof statusOrder)[number];

function parseNumber(value: string | null, fallback: number) {
  const num = value ? Number(value) : fallback;
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

async function requireUser(request: Request) {
  const cookieStore = await cookies();
  const portal = getPortalFromPath(new URL(request.url).pathname);
  const token = cookieStore.get(getSessionCookieName(portal))?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  if (!session?.user) {
    return null;
  }

  if (
    portal === "OPERATION" &&
    session.user.system !== "OPERATION" &&
    session.user.system !== "BOTH"
  ) {
    return null;
  }
  if (
    portal === "ACCOUNTING" &&
    session.user.system !== "ACCOUNTING" &&
    session.user.system !== "BOTH"
  ) {
    return null;
  }

  return session.user;
}

function generateTrackingToken() {
  const raw = crypto.randomBytes(6).toString("hex");
  return raw.slice(0, 10);
}

function normalizeStatus(value: unknown): RepairStatus | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toUpperCase();
  if ((statusOrder as readonly string[]).includes(normalized)) {
    return normalized as RepairStatus;
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseNumber(searchParams.get("page"), 1);
    const pageSize = Math.min(parseNumber(searchParams.get("pageSize"), 10), 50);
    const search = (searchParams.get("search") ?? "").trim();
    const status = normalizeStatus(searchParams.get("status"));
    const storeId = (searchParams.get("storeId") ?? "").trim();
    const excludeDelivered = searchParams.get("excludeDelivered") === "1";

    const where = {
      ...(search
        ? {
            OR: [
              {
                billNo: {
                  contains: search,
                },
              },
              {
                client: {
                  name: {
                    contains: search,
                  },
                },
              },
              {
                client: {
                  mobile: {
                    contains: search,
                  },
                },
              },
              {
                brand: {
                  name: {
                    contains: search,
                  },
                },
              },
            ],
          }
        : {}),
      ...(status
        ? { status }
        : excludeDelivered
          ? { status: { not: "DELIVERED" } }
          : {}),
      ...(storeId ? { storeId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.repair.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          client: true,
          brand: true,
          store: true,
          items: true,
        },
      }),
      prisma.repair.count({ where }),
    ]);

    return NextResponse.json(
      ok(
        {
          items,
          total,
          page,
          pageSize,
        },
        "Repairs fetched."
      ),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);
    if (!user) {
      return NextResponse.json(fail("Not authenticated.", "UNAUTHORIZED"), {
        status: 401,
      });
    }

    const body = (await request.json()) as {
      clientId?: unknown;
      brandId?: unknown;
      intakeType?: unknown;
      storeId?: unknown;
      totalAmount?: unknown;
      advanceAmount?: unknown;
      estimatedDeliveryDate?: unknown;
      description?: unknown;
      items?: unknown;
      repairTypeId?: unknown;
    };

    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
    const brandId = typeof body.brandId === "string" ? body.brandId.trim() : "";
    const intakeRaw = typeof body.intakeType === "string" ? body.intakeType.trim() : "";
    const intakeType = intakeTypeMap[intakeRaw as keyof typeof intakeTypeMap];
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";
    const advanceAmount =
      typeof body.advanceAmount === "number" ? body.advanceAmount : 0;
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
    const estimatedDeliveryDate =
      typeof body.estimatedDeliveryDate === "string"
        ? body.estimatedDeliveryDate.trim()
        : "";
    const rawItems = Array.isArray(body.items) ? body.items : null;
    const primaryRepairTypeId =
      typeof body.repairTypeId === "string" ? body.repairTypeId.trim() : "";

    if (!clientId || !brandId || !storeId || !intakeType) {
      return NextResponse.json(
        fail("Client, brand, store, and intake type are required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (
      !Number.isFinite(advanceAmount) ||
      advanceAmount < 0
    ) {
      return NextResponse.json(
        fail("Advance amount must be zero or more.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (!estimatedDeliveryDate) {
      return NextResponse.json(
        fail("Estimated delivery date is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (!rawItems || rawItems.length === 0) {
      return NextResponse.json(
        fail("At least one repair item is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const parsedItems = rawItems
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const record = item as Record<string, unknown>;
        const repairTypeId =
          typeof record.repairTypeId === "string" ? record.repairTypeId.trim() : "";
        const price =
          typeof record.price === "number"
            ? record.price
            : typeof record.price === "string"
              ? Number(record.price)
              : NaN;
        if (!repairTypeId || !Number.isFinite(price) || price <= 0) {
          return null;
        }
        return { repairTypeId, price: Math.round(price) };
      })
      .filter((item): item is { repairTypeId: string; price: number } => Boolean(item));

    if (parsedItems.length === 0) {
      return NextResponse.json(
        fail("Each repair item must include type and price.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const totalAmount = parsedItems.reduce((sum, item) => sum + item.price, 0);
    if (totalAmount <= 0) {
      return NextResponse.json(
        fail("Total amount must be a positive number.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (advanceAmount > totalAmount) {
      return NextResponse.json(
        fail("Advance amount cannot exceed total amount.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const dateMatch = estimatedDeliveryDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return NextResponse.json(
        fail("Estimated delivery date must be YYYY-MM-DD.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    const dateOnly = new Date(
      Date.UTC(
        Number(dateMatch[1]),
        Number(dateMatch[2]) - 1,
        Number(dateMatch[3])
      )
    );

    const [client, brand, store, repairTypes] = await Promise.all([
      prisma.client.findUnique({ where: { id: clientId } }),
      prisma.brand.findUnique({ where: { id: brandId } }),
      prisma.store.findUnique({ where: { id: storeId } }),
      prisma.repairType.findMany({
        where: { id: { in: parsedItems.map((item) => item.repairTypeId) } },
        select: { id: true },
      }),
    ]);

    if (!client || !brand || !store) {
      return NextResponse.json(
        fail("Client, brand, or store is invalid.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    const validTypeIds = new Set(repairTypes.map((type) => type.id));
    if (parsedItems.some((item) => !validTypeIds.has(item.repairTypeId))) {
      return NextResponse.json(
        fail("Selected repair type is invalid.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const trackingToken = generateTrackingToken();
    const trackingTokenHash = crypto
      .createHash("sha256")
      .update(trackingToken)
      .digest("hex");

    const created = await prisma.$transaction(async (tx) => {
      const sequence = await tx.repairBillSequence.upsert({
        where: { id: 1 },
        update: {},
        create: { id: 1, nextNumber: 1 },
      });
      const billNo = `RB${sequence.nextNumber}`;
      await tx.repairBillSequence.update({
        where: { id: 1 },
        data: { nextNumber: { increment: 1 } },
      });

      const repair = await tx.repair.create({
        data: {
          billNo,
          clientId,
          brandId,
          intakeType,
          storeId,
          repairTypeId: primaryRepairTypeId || parsedItems[0]?.repairTypeId,
          totalAmount,
          advanceAmount,
          estimatedDeliveryDate: dateOnly,
          description,
          trackingTokenHash,
          createdById: user.id,
        },
      });
      await tx.repairItem.createMany({
        data: parsedItems.map((item) => ({
          repairId: repair.id,
          repairTypeId: item.repairTypeId,
          price: item.price,
        })),
      });

      await tx.smsOutbox.create({
        data: {
          repairId: repair.id,
          recipient: client.mobile,
          message: `Repair ${billNo} received. Tracking token: ${trackingToken}`,
          type: "REPAIR_CREATED",
          status: "PENDING",
          scheduledFor: new Date(),
        },
      });

      await tx.repairAudit.create({
        data: {
          repairId: repair.id,
          eventType: "REPAIR_CREATED",
          oldValue: null,
          newValue: JSON.stringify({
            status: repair.status,
            estimatedDeliveryDate: repair.estimatedDeliveryDate,
          }),
          performedById: user.id,
        },
      });

      return repair;
    });

    return NextResponse.json(ok(created, "Repair created."), { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        fail("Bill number already exists.", "DUPLICATE"),
        { status: 409 }
      );
    }

    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(request);
    if (!user) {
      return NextResponse.json(fail("Not authenticated.", "UNAUTHORIZED"), {
        status: 401,
      });
    }

    const body = (await request.json()) as {
      id?: unknown;
      brandId?: unknown;
      intakeType?: unknown;
      storeId?: unknown;
      totalAmount?: unknown;
      advanceAmount?: unknown;
      description?: unknown;
      status?: unknown;
      estimatedDeliveryDate?: unknown;
      isPostponed?: unknown;
      items?: unknown;
      repairTypeId?: unknown;
    };

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const brandId = typeof body.brandId === "string" ? body.brandId.trim() : "";
    const intakeRaw = typeof body.intakeType === "string" ? body.intakeType.trim() : "";
    const intakeType = intakeTypeMap[intakeRaw as keyof typeof intakeTypeMap];
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";
    const advanceAmount =
      typeof body.advanceAmount === "number" ? body.advanceAmount : 0;
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
    const nextStatus = normalizeStatus(body.status);
    const isPostponed = typeof body.isPostponed === "boolean" ? body.isPostponed : null;
    const estimatedDeliveryDate =
      typeof body.estimatedDeliveryDate === "string"
        ? body.estimatedDeliveryDate.trim()
        : "";
    const rawItems = Array.isArray(body.items) ? body.items : null;
    const primaryRepairTypeId =
      typeof body.repairTypeId === "string" ? body.repairTypeId.trim() : "";

    if (!id) {
      return NextResponse.json(
        fail("Repair id is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const repair = await prisma.repair.findUnique({
      where: { id },
    });

    if (!repair) {
      return NextResponse.json(fail("Repair not found.", "NOT_FOUND"), {
        status: 404,
      });
    }

    const updateData: Record<string, unknown> = {};
    const audits: Array<{ eventType: string; oldValue: string | null; newValue: string | null }> = [];

    if (brandId && brandId !== repair.brandId) {
      const brand = await prisma.brand.findUnique({ where: { id: brandId } });
      if (!brand) {
        return NextResponse.json(
          fail("Selected brand is invalid.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
      updateData.brandId = brandId;
      audits.push({
        eventType: "BRAND_CHANGED",
        oldValue: repair.brandId,
        newValue: brandId,
      });
    }

    if (storeId && storeId !== repair.storeId) {
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (!store) {
        return NextResponse.json(
          fail("Selected store is invalid.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
      updateData.storeId = storeId;
      audits.push({
        eventType: "STORE_CHANGED",
        oldValue: repair.storeId,
        newValue: storeId,
      });
    }

    if (intakeType && intakeType !== repair.intakeType) {
      updateData.intakeType = intakeType;
      audits.push({
        eventType: "INTAKE_CHANGED",
        oldValue: repair.intakeType,
        newValue: intakeType,
      });
    }

    if (Number.isFinite(advanceAmount)) {
      if (advanceAmount < 0) {
        return NextResponse.json(
          fail("Advance amount must be zero or more.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
    }

    if (description !== null && description !== repair.description) {
      updateData.description = description;
      audits.push({
        eventType: "DESCRIPTION_UPDATED",
        oldValue: repair.description ?? "",
        newValue: description,
      });
    }

    let parsedItems: Array<{ repairTypeId: string; price: number }> | null = null;
    if (rawItems) {
      parsedItems = rawItems
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }
          const record = item as Record<string, unknown>;
          const repairTypeId =
            typeof record.repairTypeId === "string"
              ? record.repairTypeId.trim()
              : "";
          const price =
            typeof record.price === "number"
              ? record.price
              : typeof record.price === "string"
                ? Number(record.price)
                : NaN;
          if (!repairTypeId || !Number.isFinite(price) || price <= 0) {
            return null;
          }
          return { repairTypeId, price: Math.round(price) };
        })
        .filter(
          (item): item is { repairTypeId: string; price: number } => Boolean(item)
        );

      if (parsedItems.length === 0) {
        return NextResponse.json(
          fail("Each repair item must include type and price.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }

      const typeIds = parsedItems.map((item) => item.repairTypeId);
      const repairTypes = await prisma.repairType.findMany({
        where: { id: { in: typeIds } },
        select: { id: true },
      });
      const validTypeIds = new Set(repairTypes.map((type) => type.id));
      if (parsedItems.some((item) => !validTypeIds.has(item.repairTypeId))) {
        return NextResponse.json(
          fail("Selected repair type is invalid.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }

      const totalAmount = parsedItems.reduce((sum, item) => sum + item.price, 0);
      if (totalAmount <= 0) {
        return NextResponse.json(
          fail("Total amount must be a positive number.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
      if (advanceAmount > totalAmount) {
        return NextResponse.json(
          fail("Advance amount cannot exceed total amount.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }

      if (totalAmount !== repair.totalAmount) {
        updateData.totalAmount = totalAmount;
        audits.push({
          eventType: "TOTAL_UPDATED",
          oldValue: String(repair.totalAmount),
          newValue: String(totalAmount),
        });
      }
      if (advanceAmount !== repair.advanceAmount) {
        updateData.advanceAmount = advanceAmount;
        audits.push({
          eventType: "ADVANCE_UPDATED",
          oldValue: String(repair.advanceAmount),
          newValue: String(advanceAmount),
        });
      }
      if (primaryRepairTypeId) {
        updateData.repairTypeId = primaryRepairTypeId;
      } else if (parsedItems[0]?.repairTypeId) {
        updateData.repairTypeId = parsedItems[0].repairTypeId;
      }
    } else if (advanceAmount !== repair.advanceAmount) {
      updateData.advanceAmount = advanceAmount;
      audits.push({
        eventType: "ADVANCE_UPDATED",
        oldValue: String(repair.advanceAmount),
        newValue: String(advanceAmount),
      });
    }

    if (nextStatus && nextStatus !== repair.status) {
      const currentIndex = statusOrder.indexOf(repair.status);
      const nextIndex = statusOrder.indexOf(nextStatus);
      const allowed = nextIndex === currentIndex + 1;
      if (!allowed) {
        return NextResponse.json(
          fail("Invalid status transition.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
      updateData.status = nextStatus;
      audits.push({
        eventType: "STATUS_CHANGED",
        oldValue: repair.status,
        newValue: nextStatus,
      });
    }

    if (estimatedDeliveryDate) {
      const dateMatch = estimatedDeliveryDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!dateMatch) {
        return NextResponse.json(
          fail("Estimated delivery date must be YYYY-MM-DD.", "VALIDATION_ERROR"),
          { status: 400 }
        );
      }
      const dateOnly = new Date(
        Date.UTC(
          Number(dateMatch[1]),
          Number(dateMatch[2]) - 1,
          Number(dateMatch[3])
        )
      );
      if (dateOnly.getTime() !== repair.estimatedDeliveryDate.getTime()) {
        updateData.estimatedDeliveryDate = dateOnly;
        updateData.isPostponed = true;
        audits.push({
          eventType: "RESCHEDULED",
          oldValue: repair.estimatedDeliveryDate.toISOString(),
          newValue: dateOnly.toISOString(),
        });
      }
    } else if (isPostponed !== null) {
      updateData.isPostponed = isPostponed;
      audits.push({
        eventType: "POSTPONED_FLAG",
        oldValue: String(repair.isPostponed),
        newValue: String(isPostponed),
      });
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        fail("No changes provided.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.repair.update({
        where: { id },
        data: updateData,
      });

      if (parsedItems) {
        await tx.repairItem.deleteMany({ where: { repairId: id } });
        await tx.repairItem.createMany({
          data: parsedItems.map((item) => ({
            repairId: id,
            repairTypeId: item.repairTypeId,
            price: item.price,
          })),
        });
        audits.push({
          eventType: "ITEMS_UPDATED",
          oldValue: null,
          newValue: JSON.stringify(parsedItems),
        });
      }

      for (const audit of audits) {
        await tx.repairAudit.create({
          data: {
            repairId: id,
            eventType: audit.eventType,
            oldValue: audit.oldValue,
            newValue: audit.newValue,
            performedById: user.id,
          },
        });
      }
    });

    return NextResponse.json(ok(null, "Repair updated."), { status: 200 });
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser(request);
    if (!user) {
      return NextResponse.json(fail("Not authenticated.", "UNAUTHORIZED"), {
        status: 401,
      });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(fail("Forbidden.", "FORBIDDEN"), {
        status: 403,
      });
    }

    const body = (await request.json()) as { id?: unknown };
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json(
        fail("Repair id is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    await prisma.repair.delete({
      where: { id },
    });

    return NextResponse.json(ok(null, "Repair deleted."), { status: 200 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        fail("Repair not found.", "NOT_FOUND"),
        { status: 404 }
      );
    }

    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
