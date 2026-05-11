import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }, data] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const site = await db.site.findUnique({ where: { id: siteId, userId } });
    if (!site) return new NextResponse("Not found", { status: 404 });

    const config = await db.siteAlertConfig.upsert({
      where: { siteId },
      create: { siteId, ...data },
      update: data,
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("[ALERT_CONFIG POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await db.siteAlertConfig.delete({ where: { siteId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ALERT_CONFIG DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
