import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { userId } = await auth();
    const { eventId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedEvent = await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[DELETE_EVENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
