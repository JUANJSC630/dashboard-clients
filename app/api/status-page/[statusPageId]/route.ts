import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  brandColor: z.string().optional(),
  isPublic: z.boolean().optional(),
  customCss: z.string().optional().nullable(),
  siteIds: z.array(z.string().uuid()).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ statusPageId: string }> },
) {
  try {
    const [{ userId }, { statusPageId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const { siteIds, ...data } = parsed.data;

    const statusPage = await db.statusPage.update({
      where: { id: statusPageId, userId },
      data,
    });

    // If siteIds provided, rebuild components
    if (siteIds) {
      const sites = await db.site.findMany({
        where: { id: { in: siteIds }, userId },
        select: { id: true, name: true },
      });

      await db.statusPageComponent.deleteMany({
        where: { statusPageId },
      });

      await db.statusPageComponent.createMany({
        data: sites.map((site, i) => ({
          statusPageId,
          siteId: site.id,
          displayName: site.name,
          sortOrder: i,
        })),
      });
    }

    return NextResponse.json(statusPage);
  } catch (error) {
    return handleApiError(error, "STATUS_PAGE PATCH");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ statusPageId: string }> },
) {
  try {
    const [{ userId }, { statusPageId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    await db.statusPage.delete({
      where: { id: statusPageId, userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error, "STATUS_PAGE DELETE");
  }
}
