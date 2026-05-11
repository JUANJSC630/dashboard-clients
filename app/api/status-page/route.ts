import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  brandColor: z.string().optional(),
  siteIds: z.array(z.string().uuid()).min(1, "Select at least one site"),
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const pages = await db.statusPage.findMany({
      where: { userId },
      include: { components: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("[STATUS_PAGE GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const { siteIds, ...data } = parsed.data;

    // Verify slug is unique
    const existing = await db.statusPage.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 409 },
      );
    }

    // Verify all sites belong to user
    const sites = await db.site.findMany({
      where: { id: { in: siteIds }, userId },
      select: { id: true, name: true },
    });
    if (sites.length !== siteIds.length) {
      return NextResponse.json(
        { error: "One or more sites not found" },
        { status: 404 },
      );
    }

    const statusPage = await db.statusPage.create({
      data: {
        ...data,
        userId,
        components: {
          create: sites.map((site, i) => ({
            siteId: site.id,
            displayName: site.name,
            sortOrder: i,
          })),
        },
      },
      include: { components: true },
    });

    return NextResponse.json(statusPage);
  } catch (error) {
    console.error("[STATUS_PAGE POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
