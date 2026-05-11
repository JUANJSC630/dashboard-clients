import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mark PENDING billings as OVERDUE when nextDueDate has passed
  const result = await db.billing.updateMany({
    where: {
      status: "PENDING",
      nextDueDate: { lt: new Date() },
    },
    data: { status: "OVERDUE" },
  });

  return NextResponse.json({ updated: result.count });
}
