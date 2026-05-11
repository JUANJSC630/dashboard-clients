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

    const site = await db.site.findUnique({ where: { id: siteId } });
    if (!site) return new NextResponse("Site not found", { status: 404 });

    const incident = await db.incident.create({
      data: { siteId, userId, ...data },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error("[INCIDENT POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
