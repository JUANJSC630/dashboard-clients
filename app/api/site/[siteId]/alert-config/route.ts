import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { alertConfigSchema } from "@/lib/schemas";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }, body] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = alertConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const site = await db.site.findUnique({ where: { id: siteId, userId } });
    if (!site) return new NextResponse("Not found", { status: 404 });

    const config = await db.siteAlertConfig.upsert({
      where: { siteId },
      create: { siteId, ...parsed.data },
      update: parsed.data,
    });

    return NextResponse.json(config);
  } catch (error) {
    return handleApiError(error, "ALERT_CONFIG POST");
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
    return handleApiError(error, "ALERT_CONFIG DELETE");
  }
}
