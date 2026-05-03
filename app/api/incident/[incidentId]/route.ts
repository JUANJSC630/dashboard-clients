import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  try {
    const { userId } = await auth();
    const { incidentId } = await params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const incident = await db.incident.update({
      where: { id: incidentId, userId },
      data: values,
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error("[INCIDENT PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  try {
    const { userId } = await auth();
    const { incidentId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.incident.delete({
      where: { id: incidentId, userId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[INCIDENT DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
