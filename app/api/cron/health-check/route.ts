import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateUptime } from "@/lib/uptime";
import { sendDownAlert, sendRecoverAlert, sendWebhook } from "@/lib/email";
import { SiteStatus } from "@prisma/client";
import * as tls from "tls";

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

    // Auto-create incident when site goes down
    if (newStatus === "DOWN") {
      await db.incident.create({
        data: {
          userId: site.userId,
          siteId: site.id,
          title: `${site.name} is down`,
          description: errorMessage
            ? `Health check failed: ${errorMessage}`
            : `Health check returned HTTP ${statusCode ?? "N/A"} (latency: ${latencyMs}ms)`,
          priority: "HIGH",
          status: "OPEN",
          type: "DOWNTIME",
        },
      });
    }

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
          await sendDownAlert(cfg.alertEmail, siteInfo, {
            latencyMs,
            statusCode,
            errorMessage,
          }).catch(console.error);
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

  // ─── Check SSL certificate ──────────────────────────────────────────────
  await checkSsl(site.id, site.url).catch(() => {});

  return { isUp, statusCode, latencyMs, newStatus, alerted: statusChanged };
}

// ─── SSL certificate check ──────────────────────────────────────────────────

async function checkSsl(siteId: string, url: string) {
  let hostname: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return;
    hostname = parsed.hostname;
  } catch {
    return;
  }

  const cert = await new Promise<tls.PeerCertificate | null>(
    (resolve) => {
      const socket = tls.connect(
        { host: hostname, port: 443, servername: hostname, timeout: 5000 },
        () => {
          const c = socket.getPeerCertificate();
          socket.destroy();
          resolve(c && c.valid_to ? c : null);
        },
      );
      socket.on("error", () => { socket.destroy(); resolve(null); });
      socket.on("timeout", () => { socket.destroy(); resolve(null); });
    },
  );

  if (!cert?.valid_to) return;

  const sslExpiresAt = new Date(cert.valid_to);
  const sslDaysLeft = Math.ceil(
    (sslExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  await db.site.update({
    where: { id: siteId },
    data: { sslExpiresAt, sslDaysLeft },
  });
}
