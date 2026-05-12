import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { updateClientSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const [{ userId }, { clientId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const client = await db.client.update({
      where: { id: clientId, userId },
      data: parsed.data,
    });

    return NextResponse.json(client);
  } catch (error) {
    return handleApiError(error, "CLIENT PATCH");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const [{ userId }, { clientId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.client.delete({ where: { id: clientId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    return handleApiError(error, "CLIENT DELETE");
  }
}
