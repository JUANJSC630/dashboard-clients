import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billingId: string }> },
) {
  try {
    const { userId } = await auth();
    const { billingId } = await params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const billing = await db.billing.update({
      where: { id: billingId, userId },
      data: values,
    });

    return NextResponse.json(billing);
  } catch (error) {
    console.error("[BILLING PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ billingId: string }> },
) {
  try {
    const { userId } = await auth();
    const { billingId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.billing.delete({ where: { id: billingId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[BILLING DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
