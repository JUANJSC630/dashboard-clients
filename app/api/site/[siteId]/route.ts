import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const { userId } = await auth();
    const { siteId } = await params;
    const values = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const site = await db.site.update({
      where: { id: siteId, userId },
      data: values,
    });

    return NextResponse.json(site);
  } catch (error) {
    console.error("[SITE PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const { userId } = await auth();
    const { siteId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.site.delete({ where: { id: siteId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[SITE DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
