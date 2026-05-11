import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }, values] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Fetch current status before updating to detect changes
    const existing = await db.site.findUnique({
      where: { id: siteId, userId },
      select: { status: true },
    });

    const site = await db.site.update({
      where: { id: siteId, userId },
      data: values,
    });

    // Log status change if it changed
    if (existing && values.status && existing.status !== values.status) {
      await db.siteStatusLog.create({
        data: {
          siteId,
          userId,
          from: existing.status,
          to: values.status,
        },
      });
    }

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
    const [{ userId }, { siteId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.site.delete({ where: { id: siteId, userId } });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("[SITE DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
