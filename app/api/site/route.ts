import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSiteSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createSiteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const site = await db.site.create({
      data: { ...parsed.data, userId },
    });

    return NextResponse.json(site);
  } catch (error) {
    console.error("[SITE POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
