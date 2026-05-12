import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { createIncidentSchema } from "@/lib/schemas";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createIncidentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const site = await db.site.findUnique({ where: { id: siteId } });
    if (!site) return new NextResponse("Site not found", { status: 404 });

    const incident = await db.incident.create({
      data: { siteId, userId, ...parsed.data },
    });

    return NextResponse.json(incident);
  } catch (error) {
    return handleApiError(error, "INCIDENT POST");
  }
}
