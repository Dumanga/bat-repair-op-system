import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";

export async function GET() {
  try {
    const sequence = await prisma.repairBillSequence.findUnique({
      where: { id: 1 },
    });
    const nextNumber = sequence?.nextNumber ?? 1;
    const billNo = `RB${nextNumber}`;

    return NextResponse.json(
      ok({ billNo, nextNumber }, "Next bill number generated."),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
