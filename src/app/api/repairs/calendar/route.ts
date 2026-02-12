import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fail, ok } from "@/lib/api/response";

function parseMonth(value: string | null) {
  if (!value) {
    return null;
  }
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = parseMonth(searchParams.get("month"));
    if (!monthParam) {
      return NextResponse.json(
        fail("Month is required in YYYY-MM format.", "VALIDATION_ERROR"),
        { status: 400 }
      );
    }

    const { year, month } = monthParam;
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    const rows = await prisma.$queryRaw<
      Array<{ day: string; count: bigint }>
    >`
      SELECT DATE_FORMAT(estimatedDeliveryDate, '%Y-%m-%d') AS day, COUNT(*) AS count
      FROM Repair
      WHERE estimatedDeliveryDate >= ${start}
        AND estimatedDeliveryDate < ${end}
        AND status <> 'DELIVERED'
      GROUP BY DATE_FORMAT(estimatedDeliveryDate, '%Y-%m-%d')
    `;

    const counts: Record<string, number> = {};
    for (const row of rows) {
      const day = row.day;
      const count = Number(row.count);
      if (day) {
        counts[day] = count;
      }
    }

    return NextResponse.json(
      ok(
        {
          month: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`,
          counts,
        },
        "Calendar counts fetched."
      ),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(fail("Unexpected server error.", "SERVER_ERROR"), {
      status: 500,
    });
  }
}
