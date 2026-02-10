import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";

const allowedAccess = [
  "dashboard",
  "repairs",
  "clients",
  "brands",
  "users",
  "sms",
  "settings",
] as const;

type AccessKey = (typeof allowedAccess)[number];

function parseNumber(value: string | null, fallback: number) {
  const num = value ? Number(value) : fallback;
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function sanitizeAccess(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry) => typeof entry === "string")
    .map((entry) => entry.toLowerCase().trim())
    .filter((entry): entry is AccessKey =>
      (allowedAccess as readonly string[]).includes(entry)
    );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseNumber(searchParams.get("page"), 1);
    const pageSize = Math.min(parseNumber(searchParams.get("pageSize"), 10), 50);
    const search = (searchParams.get("search") ?? "").trim();

    const baseWhere = {
      system: {
        in: ["OPERATION", "BOTH"],
      },
    };

    const where = search
      ? {
          AND: [
            baseWhere,
            {
              OR: [
                {
                  displayName: {
                    contains: search,
                  },
                },
                {
                  username: {
                    contains: search,
                  },
                },
              ],
            },
          ],
        }
      : baseWhere;

    const [items, total, superAdminCount, staffCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          username: true,
          displayName: true,
          role: true,
          system: true,
          profileImageId: true,
          createdAt: true,
          storeId: true,
          store: {
            select: {
              id: true,
              name: true,
            },
          },
          accessDashboard: true,
          accessRepairs: true,
          accessClients: true,
          accessBrands: true,
          accessUsers: true,
          accessSms: true,
          accessSettings: true,
        },
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { ...baseWhere, role: "SUPER_ADMIN" } }),
      prisma.user.count({
        where: { ...baseWhere, role: { in: ["CASHIER", "REPAIR_STAFF"] } },
      }),
    ]);

    return NextResponse.json(
      ok(
        {
          items,
          total,
          superAdminCount,
          staffCount,
          page,
          pageSize,
        },
        "Users fetched."
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
    const body = (await request.json()) as {
      username?: unknown;
      displayName?: unknown;
      password?: unknown;
      role?: unknown;
      profileImageId?: unknown;
      access?: unknown;
      storeId?: unknown;
    };

    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const profileImageId =
      typeof body.profileImageId === "number" ? body.profileImageId : null;
    const access = sanitizeAccess(body.access);
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";

    if (!username || !displayName || !password) {
      return NextResponse.json(
        fail("Username, name, and password are required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (role !== "CASHIER" && role !== "REPAIR_STAFF") {
      return NextResponse.json(
        fail("Role must be Cashier or Repair Staff.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!profileImageId || profileImageId < 1 || profileImageId > 5) {
      return NextResponse.json(
        fail("Profile image must be selected.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (access.length === 0) {
      return NextResponse.json(
        fail("Select at least one access area.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (access.length === allowedAccess.length) {
      return NextResponse.json(
        fail("All access cannot be selected. Use Super Admin instead.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        fail("Store assignment is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        fail("Selected store is invalid.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const created = await prisma.user.create({
      data: {
        username,
        displayName,
        passwordHash,
        role,
        system: "OPERATION",
        profileImageId,
        storeId,
        accessDashboard: access.includes("dashboard"),
        accessRepairs: access.includes("repairs"),
        accessClients: access.includes("clients"),
        accessBrands: access.includes("brands"),
        accessUsers: access.includes("users"),
        accessSms: access.includes("sms"),
        accessSettings: access.includes("settings"),
      },
    });

    return NextResponse.json(
      ok(
        {
          id: created.id,
        },
        "User created."
      ),
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        fail("Username already exists.", "DUPLICATE"),
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
    const body = (await request.json()) as {
      id?: unknown;
      username?: unknown;
      displayName?: unknown;
      password?: unknown;
      role?: unknown;
      profileImageId?: unknown;
      access?: unknown;
      storeId?: unknown;
    };

    const id = typeof body.id === "string" ? body.id.trim() : "";
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";
    const password =
      typeof body.password === "string" ? body.password.trim() : "";
    const role = typeof body.role === "string" ? body.role.trim() : "";
    const profileImageId =
      typeof body.profileImageId === "number" ? body.profileImageId : null;
    const access = sanitizeAccess(body.access);
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";

    if (!id) {
      return NextResponse.json(
        fail("User id is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!username || !displayName) {
      return NextResponse.json(
        fail("Username and name are required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (role !== "CASHIER" && role !== "REPAIR_STAFF") {
      return NextResponse.json(
        fail("Role must be Cashier or Repair Staff.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!profileImageId || profileImageId < 1 || profileImageId > 5) {
      return NextResponse.json(
        fail("Profile image must be selected.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (access.length === 0) {
      return NextResponse.json(
        fail("Select at least one access area.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (access.length === allowedAccess.length) {
      return NextResponse.json(
        fail("All access cannot be selected. Use Super Admin instead.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        fail("Store assignment is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true },
    });

    if (!store) {
      return NextResponse.json(
        fail("Selected store is invalid.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      username,
      displayName,
      role,
      profileImageId,
      storeId,
      accessDashboard: access.includes("dashboard"),
      accessRepairs: access.includes("repairs"),
      accessClients: access.includes("clients"),
      accessBrands: access.includes("brands"),
      accessUsers: access.includes("users"),
      accessSms: access.includes("sms"),
      accessSettings: access.includes("settings"),
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12);
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(ok(null, "User updated."), { status: 200 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        fail("Username already exists.", "DUPLICATE"),
        { status: 409 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        fail("User not found.", "NOT_FOUND"),
        { status: 404 }
      );
    }

    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { id?: unknown };
    const id = typeof body.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json(
        fail("User id is required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(fail("User not found.", "NOT_FOUND"), {
        status: 404,
      });
    }

    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        fail("Super Admin cannot be deleted.", "FORBIDDEN"),
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(ok(null, "User deleted."), { status: 200 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code === "P2025"
    ) {
      return NextResponse.json(
        fail("User not found.", "NOT_FOUND"),
        { status: 404 }
      );
    }

    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
