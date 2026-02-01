import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { fail, ok } from "@/lib/api/response";
import type { LoginRequestDTO } from "@/lib/auth/dto";
import type { LoginResponseDTO } from "@/lib/auth/dto";
import { prisma } from "@/lib/db";

const allowedKeys = new Set<keyof LoginRequestDTO>(["identifier", "password"]);

async function parseBody(request: Request): Promise<Partial<LoginRequestDTO>> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as Partial<LoginRequestDTO>;
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const form = await request.formData();
    return Object.fromEntries(form.entries()) as Partial<LoginRequestDTO>;
  }

  return {};
}

export async function POST(request: Request) {
  try {
    const data = await parseBody(request);
    const incomingKeys = Object.keys(data);

    for (const key of incomingKeys) {
      if (!allowedKeys.has(key as keyof LoginRequestDTO)) {
        return NextResponse.json(
          fail("Unknown field provided.", "UNKNOWN_FIELD"),
          { status: 400 }
        );
      }
    }

    const identifier =
      typeof data.identifier === "string" ? data.identifier.trim() : "";
    const password =
      typeof data.password === "string" ? data.password.trim() : "";

    if (!identifier || !password) {
      return NextResponse.json(
        fail("Identifier and password are required.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }
    const user = await prisma.user.findFirst({
      where: {
        username: identifier,
      },
    });

    if (!user) {
      return NextResponse.json(
        fail("Invalid credentials.", "INVALID_CREDENTIALS"),
        { status: 401 }
      );
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return NextResponse.json(
        fail("Invalid credentials.", "INVALID_CREDENTIALS"),
        { status: 401 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await prisma.session.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set("dob_session", rawToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: expiresAt,
    });

    const response: LoginResponseDTO = {
      userId: user.id,
      role: user.role,
      displayName: user.displayName,
    };

    return NextResponse.json(ok(response, "Login successful."), { status: 200 });
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
