import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const { userId } = await auth();
    const { clientId } = await params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const client = await db.client.update({
      where: { id: clientId, userId },
      data: values,
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("[CLIENT PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> },
) {
  try {
    const { userId } = await auth();
    const { clientId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.client.delete({ where: { id: clientId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[CLIENT DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
