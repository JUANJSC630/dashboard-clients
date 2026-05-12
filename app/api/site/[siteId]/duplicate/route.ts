import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const { userId } = await auth();
    const { siteId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const original = await db.site.findUnique({
      where: { id: siteId, userId },
    });

    if (!original) return new NextResponse("Not Found", { status: 404 });

    const copy = await db.site.create({
      data: {
        userId,
        clientId: original.clientId,
        name: `Copy of ${original.name}`,
        url: original.url,
        platform: original.platform,
        platformProjectId: original.platformProjectId,
        repositoryUrl: original.repositoryUrl,
        techStack: original.techStack,
        status: "PAUSED",
        description: original.description,
      },
    });

    return NextResponse.json(copy);
  } catch (error) {
    return handleApiError(error, "SITE DUPLICATE");
  }
}
