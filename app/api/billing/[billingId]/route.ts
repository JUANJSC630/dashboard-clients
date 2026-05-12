import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { updateBillingSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ billingId: string }> },
) {
  try {
    const [{ userId }, { billingId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateBillingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const { nextDueDate, ...rest } = parsed.data;

    const billing = await db.billing.update({
      where: { id: billingId, userId },
      data: {
        ...rest,
        ...(nextDueDate && { nextDueDate: new Date(nextDueDate) }),
      },
    });

    return NextResponse.json(billing);
  } catch (error) {
    return handleApiError(error, "BILLING PATCH");
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
    return handleApiError(error, "BILLING DELETE");
  }
}
