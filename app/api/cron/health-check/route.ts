import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateUptime } from "@/lib/uptime";
import { SiteStatus } from "@prisma/client";

// Vercel llama GET; GitHub Actions usa curl GET con el header Authorization
export async function GET(request: Request) {
  // ─── Auth ────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Fetch all monitorable sites ─────────────────────────────────────────
  const sites = await db.site.findMany({
    where: {
      status: { in: ["ACTIVE", "DOWN", "MAINTENANCE"] },
    },
    select: {
      id: true,
      userId: true,
      url: true,
      status: true,
      name: true,
    },
  });

  if (sites.length === 0) {
    return NextResponse.json({ checked: 0 });
  }

  // ─── Check each site in parallel ─────────────────────────────────────────
  const results = await Promise.allSettled(
    sites.map((site) => checkSite(site)),
  );

  const summary = results.map((r, i) => ({
    site: sites[i].name,
    ...(r.status === "fulfilled" ? r.value : { error: String(r.reason) }),
  }));

  return NextResponse.json({ checked: sites.length, results: summary });
}

// ─── Single site check ──────────────────────────────────────────────────────

async function checkSite(site: {
  id: string;
  userId: string;
  url: string;
  status: SiteStatus;
  name: string;
}) {
  const start = Date.now();
  let isUp = false;
  let statusCode: number | undefined;
  let errorMessage: string | undefined;

  try {
    const res = await fetch(site.url, {
      signal: AbortSignal.timeout(8000),
      // Solo necesitamos saber si responde
      method: "GET",
      headers: { "User-Agent": "dashboard-health-check/1.0" },
    });
    statusCode = res.status;
    // Considera UP cualquier respuesta HTTP (incluso 4xx son respuestas válidas)
    isUp = res.status < 500;
  } catch (err) {
    isUp = false;
    errorMessage =
      err instanceof Error ? err.message : "Unknown error";
  }

  const latencyMs = Date.now() - start;

  // ─── Persist ping log ───────────────────────────────────────────────────
  await db.sitePingLog.create({
    data: { siteId: site.id, isUp, statusCode, latencyMs, errorMessage },
  });

  // ─── Update site status if changed ─────────────────────────────────────
  const newStatus: SiteStatus = isUp ? "ACTIVE" : "DOWN";

  if (newStatus !== site.status) {
    await db.$transaction([
      db.site.update({
        where: { id: site.id },
        data: { status: newStatus, lastCheckedAt: new Date() },
      }),
      db.siteStatusLog.create({
        data: {
          siteId: site.id,
          userId: site.userId,
          from: site.status,
          to: newStatus,
        },
      }),
      // Auto-resolve open incidents when site recovers
      ...(newStatus === "ACTIVE"
        ? [
            db.incident.updateMany({
              where: {
                siteId: site.id,
                status: { in: ["OPEN", "IN_PROGRESS"] },
              },
              data: { status: "RESOLVED", resolvedAt: new Date() },
            }),
          ]
        : []),
    ]);
  } else {
    await db.site.update({
      where: { id: site.id },
      data: { lastCheckedAt: new Date() },
    });
  }

  // ─── Recalculate uptime (last 24h) ─────────────────────────────────────
  const uptimePercent = await calculateUptime(site.id, 24);
  if (uptimePercent !== null) {
    await db.site.update({
      where: { id: site.id },
      data: { uptimePercent },
    });
  }

  return { isUp, statusCode, latencyMs, newStatus };
}
