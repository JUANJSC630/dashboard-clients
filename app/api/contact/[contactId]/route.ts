import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { updateContactSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ contactId: string }> },
) {
  try {
    const [{ userId }, { contactId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    // Verify the contact belongs to a site owned by this user
    const contact = await db.contact.findUnique({
      where: { id: contactId },
      select: { site: { select: { userId: true } } },
    });
    if (!contact || contact.site.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }

    const updated = await db.contact.update({
      where: { id: contactId },
      data: parsed.data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error, "CONTACT PATCH");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ contactId: string }> },
) {
  try {
    const [{ userId }, { contactId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Verify the contact belongs to a site owned by this user
    const contact = await db.contact.findUnique({
      where: { id: contactId },
      select: { site: { select: { userId: true } } },
    });
    if (!contact || contact.site.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }

    await db.contact.delete({ where: { id: contactId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error, "CONTACT DELETE");
  }
}
