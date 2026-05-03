import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Change to noreply@yourdomain.com once you verify a domain on resend.com/domains
const FROM = "Hosting Dashboard <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type SiteInfo = {
  id: string;
  name: string;
  url: string;
};

function layout(accentColor: string, content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Hosting Dashboard Alert</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <!-- Header bar -->
        <tr>
          <td style="background:${accentColor};padding:0;height:5px;"></td>
        </tr>

        <!-- Logo + nav -->
        <tr>
          <td style="padding:24px 40px 20px;border-bottom:1px solid #e2e8f0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-.3px;">⚡ Hosting Dashboard</span>
                </td>
                <td align="right">
                  <a href="${APP_URL}" style="font-size:12px;color:#64748b;text-decoration:none;">Open Dashboard →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        ${content}

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
              You're receiving this because alert notifications are enabled for this site.<br>
              To manage your alerts, visit the site settings in your
              <a href="${APP_URL}" style="color:#6366f1;text-decoration:none;">dashboard</a>.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function statusBadge(label: string, bg: string, color: string) {
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:.5px;">${label}</span>`;
}

export async function sendDownAlert(to: string, site: SiteInfo, extra?: { latencyMs?: number; statusCode?: number; errorMessage?: string }) {
  const now = new Date();
  const timeStr = now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

  const body = layout("#ef4444", `
    <tr>
      <td style="padding:32px 40px 8px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px;vertical-align:middle;">
              <div style="width:48px;height:48px;background:#fef2f2;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;text-align:center;line-height:48px;">🔴</div>
            </td>
            <td style="vertical-align:middle;">
              ${statusBadge("DOWN", "#fef2f2", "#ef4444")}
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.2;">${site.name} is down</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:16px 40px 0;">
        <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
          Your site stopped responding to health checks. An incident has been automatically created and open tickets have been flagged.
        </p>
      </td>
    </tr>

    <!-- Details box -->
    <tr>
      <td style="padding:20px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:10px;border-bottom:1px solid #fecaca;">
                    <span style="font-size:11px;font-weight:600;color:#9f1239;text-transform:uppercase;letter-spacing:.8px;">Incident Details</span>
                  </td>
                </tr>
                <tr><td style="padding-top:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;width:120px;">Site</td>
                      <td style="font-size:13px;color:#0f172a;font-weight:600;padding-bottom:6px;">${site.name}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">URL</td>
                      <td style="font-size:13px;padding-bottom:6px;"><a href="${site.url}" style="color:#ef4444;text-decoration:none;">${site.url}</a></td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">Detected at</td>
                      <td style="font-size:13px;color:#0f172a;padding-bottom:6px;">${timeStr}</td>
                    </tr>
                    ${extra?.statusCode ? `<tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">HTTP Status</td>
                      <td style="font-size:13px;color:#ef4444;font-weight:600;padding-bottom:6px;">${extra.statusCode}</td>
                    </tr>` : ""}
                    ${extra?.latencyMs ? `<tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">Last latency</td>
                      <td style="font-size:13px;color:#0f172a;padding-bottom:6px;">${extra.latencyMs}ms</td>
                    </tr>` : ""}
                    ${extra?.errorMessage ? `<tr>
                      <td style="font-size:13px;color:#64748b;">Error</td>
                      <td style="font-size:13px;color:#ef4444;font-family:monospace;">${extra.errorMessage}</td>
                    </tr>` : ""}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:28px 40px 32px;">
        <a href="${APP_URL}/sites/${site.id}" style="display:inline-block;background:#ef4444;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">View Incident →</a>
      </td>
    </tr>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `🔴 [DOWN] ${site.name} is not responding`,
    html: body,
  });
}

export async function sendRecoverAlert(to: string, site: SiteInfo, extra?: { downtimeMin?: number; uptimePercent?: number }) {
  const now = new Date();
  const timeStr = now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

  const body = layout("#22c55e", `
    <tr>
      <td style="padding:32px 40px 8px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-right:12px;vertical-align:middle;">
              <div style="width:48px;height:48px;background:#f0fdf4;border-radius:12px;font-size:24px;text-align:center;line-height:48px;">🟢</div>
            </td>
            <td style="vertical-align:middle;">
              ${statusBadge("RECOVERED", "#f0fdf4", "#16a34a")}
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#0f172a;line-height:1.2;">${site.name} is back online</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:16px 40px 0;">
        <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">
          Great news — your site is responding normally again. Open incidents have been automatically resolved.
        </p>
      </td>
    </tr>

    <!-- Details box -->
    <tr>
      <td style="padding:20px 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:10px;border-bottom:1px solid #bbf7d0;">
                    <span style="font-size:11px;font-weight:600;color:#14532d;text-transform:uppercase;letter-spacing:.8px;">Recovery Details</span>
                  </td>
                </tr>
                <tr><td style="padding-top:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;width:120px;">Site</td>
                      <td style="font-size:13px;color:#0f172a;font-weight:600;padding-bottom:6px;">${site.name}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">URL</td>
                      <td style="font-size:13px;padding-bottom:6px;"><a href="${site.url}" style="color:#16a34a;text-decoration:none;">${site.url}</a></td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">Recovered at</td>
                      <td style="font-size:13px;color:#0f172a;padding-bottom:6px;">${timeStr}</td>
                    </tr>
                    ${extra?.downtimeMin ? `<tr>
                      <td style="font-size:13px;color:#64748b;padding-bottom:6px;">Total downtime</td>
                      <td style="font-size:13px;color:#0f172a;font-weight:600;padding-bottom:6px;">${extra.downtimeMin < 60 ? `${extra.downtimeMin} min` : `${Math.floor(extra.downtimeMin / 60)}h ${extra.downtimeMin % 60}min`}</td>
                    </tr>` : ""}
                    ${extra?.uptimePercent !== undefined ? `<tr>
                      <td style="font-size:13px;color:#64748b;">Uptime (24h)</td>
                      <td style="font-size:13px;color:#16a34a;font-weight:600;">${extra.uptimePercent.toFixed(2)}%</td>
                    </tr>` : ""}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:28px 40px 32px;">
        <a href="${APP_URL}/sites/${site.id}" style="display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">View Site →</a>
      </td>
    </tr>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `🟢 [RECOVERED] ${site.name} is back online`,
    html: body,
  });
}

export async function sendWebhook(
  webhookUrl: string,
  event: "down" | "recover",
  site: SiteInfo,
) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        site: { id: site.id, name: site.name, url: site.url },
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Webhook failures are silent — don't block the cron
  }
}
