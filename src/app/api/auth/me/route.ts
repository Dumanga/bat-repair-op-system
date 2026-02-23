import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { getSessionCookieName, hashSessionToken, resolvePortal } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const portal = resolvePortal(request);
    const token = cookieStore.get(getSessionCookieName(portal))?.value;

    if (!token) {
      return NextResponse.json(
        fail("Not authenticated.", "UNAUTHORIZED"),
        { status: 401 }
      );
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
      return NextResponse.json(
        fail("Not authenticated.", "UNAUTHORIZED"),
        { status: 401 }
      );
    }

    if (
      portal === "OPERATION" &&
      session.user.system !== "OPERATION" &&
      session.user.system !== "BOTH"
    ) {
      return NextResponse.json(
        fail("Not authorized for this portal.", "FORBIDDEN"),
        { status: 403 }
      );
    }
    if (
      portal === "ACCOUNTING" &&
      session.user.system !== "ACCOUNTING" &&
      session.user.system !== "BOTH"
    ) {
      return NextResponse.json(
        fail("Not authorized for this portal.", "FORBIDDEN"),
        { status: 403 }
      );
    }

    return NextResponse.json(
      ok(
        {
          userId: session.user.id,
          role: session.user.role,
          system: session.user.system,
          displayName: session.user.displayName,
          profileImageId: session.user.profileImageId,
          storeId: session.user.storeId,
          accessDashboard: session.user.accessDashboard,
          accessRepairs: session.user.accessRepairs,
          accessClients: session.user.accessClients,
          accessBrands: session.user.accessBrands,
          accessUsers: session.user.accessUsers,
          accessStores: session.user.accessStores,
          accessSms: session.user.accessSms,
          accessSettings: session.user.accessSettings,
        },
        "Session active."
      ),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
