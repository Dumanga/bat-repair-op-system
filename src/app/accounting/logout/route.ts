import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getSessionCookieName, hashSessionToken } from "@/lib/auth/session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const cookieName = getSessionCookieName("ACCOUNTING");
  const token = cookieStore.get(cookieName)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);
    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return NextResponse.redirect(new URL("/accounting/login", request.url));
}
