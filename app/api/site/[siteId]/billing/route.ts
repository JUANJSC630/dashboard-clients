import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const { userId } = await auth();
    const { siteId } = await params;
    const data = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const site = await db.site.findUnique({ where: { id: siteId } });
    if (!site) return new NextResponse("Site not found", { status: 404 });

    const billing = await db.billing.create({
      data: { siteId, clientId: site.clientId, userId, ...data },
    });

    return NextResponse.json(billing);
  } catch (error) {
    console.error("[BILLING POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
