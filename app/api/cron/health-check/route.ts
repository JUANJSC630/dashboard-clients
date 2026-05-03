import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateUptime } from "@/lib/uptime";
import { sendDownAlert, sendRecoverAlert, sendWebhook } from "@/lib/email";
import { SiteStatus } from "@prisma/client";

export async function GET(request: Request) {
  // ─── Auth ────────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ─── Fetch all monitorable sites (include alert config) ──────────────────
  const sites = await db.site.findMany({
    where: { status: { in: ["ACTIVE", "DOWN", "MAINTENANCE"] } },
    select: {
      id: true,
      userId: true,
      url: true,
      status: true,
      name: true,
      alertConfig: true,
    },
  });

  if (sites.length === 0) return NextResponse.json({ checked: 0 });

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
  alertConfig: {
    id: string;
    alertEmail: string;
    onDown: boolean;
    onRecover: boolean;
    cooldownMinutes: number;
    lastAlertSentAt: Date | null;
    webhookUrl: string | null;
  } | null;
}) {
  const start = Date.now();
  let isUp = false;
  let statusCode: number | undefined;
  let errorMessage: string | undefined;

  try {
    const res = await fetch(site.url, {
      signal: AbortSignal.timeout(8000),
      method: "GET",
      headers: { "User-Agent": "dashboard-health-check/1.0" },
    });
    statusCode = res.status;
    isUp = res.status < 500;
  } catch (err) {
    isUp = false;
    errorMessage = err instanceof Error ? err.message : "Unknown error";
  }

  const latencyMs = Date.now() - start;

  // ─── Persist ping log ───────────────────────────────────────────────────
  await db.sitePingLog.create({
    data: { siteId: site.id, isUp, statusCode, latencyMs, errorMessage },
  });

  // ─── Detect status change ───────────────────────────────────────────────
  const newStatus: SiteStatus = isUp ? "ACTIVE" : "DOWN";
  const statusChanged = newStatus !== site.status;

  if (statusChanged) {
    await db.$transaction([
      db.site.update({
        where: { id: site.id },
        data: { status: newStatus, lastCheckedAt: new Date() },
      }),
      db.siteStatusLog.create({
        data: { siteId: site.id, userId: site.userId, from: site.status, to: newStatus },
      }),
      ...(newStatus === "ACTIVE"
        ? [
            db.incident.updateMany({
              where: { siteId: site.id, status: { in: ["OPEN", "IN_PROGRESS"] } },
              data: { status: "RESOLVED", resolvedAt: new Date() },
            }),
          ]
        : []),
    ]);

    // ─── Send alerts if configured ────────────────────────────────────────
    if (site.alertConfig) {
      const cfg = site.alertConfig;
      const siteInfo = { id: site.id, name: site.name, url: site.url };

      const cooldownPassed =
        !cfg.lastAlertSentAt ||
        Date.now() - cfg.lastAlertSentAt.getTime() >
          cfg.cooldownMinutes * 60 * 1000;

      const shouldAlert =
        (newStatus === "DOWN" && cfg.onDown) ||
        (newStatus === "ACTIVE" && cfg.onRecover);

      if (shouldAlert && cooldownPassed) {
        // Send email
        if (newStatus === "DOWN") {
          await sendDownAlert(cfg.alertEmail, siteInfo).catch(console.error);
        } else {
          await sendRecoverAlert(cfg.alertEmail, siteInfo).catch(console.error);
        }

        // Send webhook if configured
        if (cfg.webhookUrl) {
          await sendWebhook(
            cfg.webhookUrl,
            newStatus === "DOWN" ? "down" : "recover",
            siteInfo,
          );
        }

        // Update lastAlertSentAt
        await db.siteAlertConfig.update({
          where: { id: cfg.id },
          data: { lastAlertSentAt: new Date() },
        });
      }
    }
  } else {
    await db.site.update({
      where: { id: site.id },
      data: { lastCheckedAt: new Date() },
    });
  }

  // ─── Recalculate uptime ─────────────────────────────────────────────────
  const uptimePercent = await calculateUptime(site.id, 24);
  if (uptimePercent !== null) {
    await db.site.update({ where: { id: site.id }, data: { uptimePercent } });
  }

  return { isUp, statusCode, latencyMs, newStatus, alerted: statusChanged };
}
