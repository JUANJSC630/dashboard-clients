import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { updateBillingSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billingId: string }> },
) {
  try {
    const [{ userId }, { billingId }, body] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateBillingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const billing = await db.billing.update({
      where: { id: billingId, userId },
      data: parsed.data,
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
    const [{ userId }, { billingId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.billing.delete({
      where: { id: billingId, userId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[BILLING DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
