import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { hashSessionToken } from "@/lib/auth/session";

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

async function requireUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dob_session")?.value;

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

  if (session.user.system !== "OPERATION" && session.user.system !== "BOTH") {
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
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(fail("Not authenticated.", "UNAUTHORIZED"), {
        status: 401,
      });
    }

    const body = (await request.json()) as {
      billNo?: unknown;
      clientId?: unknown;
      brandId?: unknown;
      intakeType?: unknown;
      storeId?: unknown;
      totalAmount?: unknown;
      advanceAmount?: unknown;
      estimatedDeliveryDate?: unknown;
      description?: unknown;
    };

    const billNo = typeof body.billNo === "string" ? body.billNo.trim() : "";
    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
    const brandId = typeof body.brandId === "string" ? body.brandId.trim() : "";
    const intakeRaw = typeof body.intakeType === "string" ? body.intakeType.trim() : "";
    const intakeType = intakeTypeMap[intakeRaw as keyof typeof intakeTypeMap];
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";
    const totalAmount = typeof body.totalAmount === "number" ? body.totalAmount : null;
    const advanceAmount = typeof body.advanceAmount === "number" ? body.advanceAmount : null;
    const description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
    const estimatedDeliveryDate =
      typeof body.estimatedDeliveryDate === "string"
        ? body.estimatedDeliveryDate.trim()
        : "";

    if (!billNo) {
      return NextResponse.json(
        fail("Bill number is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (!clientId || !brandId || !storeId || !intakeType) {
      return NextResponse.json(
        fail("Client, brand, store, and intake type are required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (!Number.isFinite(totalAmount) || totalAmount === null || totalAmount <= 0) {
      return NextResponse.json(
        fail("Total amount must be a positive number.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (
      !Number.isFinite(advanceAmount) ||
      advanceAmount === null ||
      advanceAmount < 0
    ) {
      return NextResponse.json(
        fail("Advance amount must be zero or more.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (advanceAmount > totalAmount) {
      return NextResponse.json(
        fail("Advance amount cannot exceed total amount.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    if (!estimatedDeliveryDate) {
      return NextResponse.json(
        fail("Estimated delivery date is required.", "VALIDATION_ERROR"),
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

    const [client, brand, store] = await Promise.all([
      prisma.client.findUnique({ where: { id: clientId } }),
      prisma.brand.findUnique({ where: { id: brandId } }),
      prisma.store.findUnique({ where: { id: storeId } }),
    ]);

    if (!client || !brand || !store) {
      return NextResponse.json(
        fail("Client, brand, or store is invalid.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const trackingToken = generateTrackingToken();
    const trackingTokenHash = crypto
      .createHash("sha256")
      .update(trackingToken)
      .digest("hex");

    const created = await prisma.$transaction(async (tx) => {
      const repair = await tx.repair.create({
        data: {
          billNo,
          clientId,
          brandId,
          intakeType,
          storeId,
          totalAmount,
          advanceAmount,
          estimatedDeliveryDate: dateOnly,
          description,
          trackingTokenHash,
          createdById: user.id,
        },
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
    const user = await requireUser();
    if (!user) {
      return NextResponse.json(fail("Not authenticated.", "UNAUTHORIZED"), {
        status: 401,
      });
    }

    const body = (await request.json()) as {
      id?: unknown;
      status?: unknown;
      estimatedDeliveryDate?: unknown;
      isPostponed?: unknown;
    };

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const nextStatus = normalizeStatus(body.status);
    const isPostponed = typeof body.isPostponed === "boolean" ? body.isPostponed : null;
    const estimatedDeliveryDate =
      typeof body.estimatedDeliveryDate === "string"
        ? body.estimatedDeliveryDate.trim()
        : "";

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
      updateData.estimatedDeliveryDate = dateOnly;
      updateData.isPostponed = true;
      audits.push({
        eventType: "RESCHEDULED",
        oldValue: repair.estimatedDeliveryDate.toISOString(),
        newValue: dateOnly.toISOString(),
      });
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
    const user = await requireUser();
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
