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

    const site = await db.site.findUnique({
      where: { id: siteId, userId },
      select: { id: true, url: true, status: true },
    });

    if (!site) return new NextResponse("Not Found", { status: 404 });

    const start = Date.now();
    let newStatus: "ACTIVE" | "DOWN" = "ACTIVE";
    let latencyMs: number | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(site.url, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timeout);
      latencyMs = Date.now() - start;
      newStatus = res.ok ? "ACTIVE" : "DOWN";
    } catch {
      newStatus = "DOWN";
    }

    const prevStatus = site.status;

    const updated = await db.site.update({
      where: { id: siteId },
      data: {
        status: newStatus,
        lastCheckedAt: new Date(),
      },
    });

    // Log status change if it changed
    if (prevStatus !== newStatus) {
      await db.siteStatusLog.create({
        data: { siteId, userId, from: prevStatus, to: newStatus },
      });
    }

    return NextResponse.json({ status: newStatus, latencyMs, site: updated });
  } catch (error) {
    return handleApiError(error, "SITE PING");
  }
}
