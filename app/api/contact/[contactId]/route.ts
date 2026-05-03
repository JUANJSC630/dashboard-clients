import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ contactId: string }> },
) {
  try {
    const { userId } = await auth();
    const { contactId } = await params;
    const data = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const contact = await db.contact.update({
      where: { id: contactId },
      data,
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("[CONTACT PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ contactId: string }> },
) {
  try {
    const { userId } = await auth();
    const { contactId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await db.contact.delete({ where: { id: contactId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CONTACT DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
