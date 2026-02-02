import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";
import { hashSessionToken } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("dob_session")?.value;

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

    return NextResponse.json(
      ok(
        {
          userId: session.user.id,
          role: session.user.role,
          displayName: session.user.displayName,
          profileImageId: session.user.profileImageId,
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
