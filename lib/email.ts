import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Resend free tier allows sending from onboarding@resend.dev to any verified email.
// Once you verify a domain on resend.com, change this to: noreply@yourdomain.com
const FROM = "Hosting Dashboard <onboarding@resend.dev>";

type SiteInfo = {
  name: string;
  url: string;
  id: string;
};

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
    .header { padding: 24px 32px; }
    .body { padding: 24px 32px 32px; }
    .footer { padding: 16px 32px; background: #f4f4f5; font-size: 12px; color: #71717a; text-align: center; }
    h1 { margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #18181b; }
    p { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #3f3f46; }
    .meta { background: #f4f4f5; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-size: 13px; color: #52525b; }
    .meta strong { color: #18181b; }
    .btn { display: inline-block; margin-top: 20px; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; }
    .btn-red { background: #ef4444; color: #fff; }
    .btn-green { background: #22c55e; color: #fff; }
  </style>
</head>
<body>
  <div class="wrapper">
    ${content}
    <div class="footer">Hosting Dashboard · <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}" style="color:#6366f1">Open Dashboard</a></div>
  </div>
</body>
</html>`;
}

export async function sendDownAlert(to: string, site: SiteInfo) {
  const html = baseTemplate(`
    <div class="header" style="border-top: 4px solid #ef4444;">
      <h1>🔴 Site Down — ${site.name}</h1>
    </div>
    <div class="body">
      <p>Your site <strong>${site.name}</strong> is not responding. The automated health check failed to reach it.</p>
      <div class="meta">
        <div><strong>Site:</strong> ${site.name}</div>
        <div><strong>URL:</strong> <a href="${site.url}">${site.url}</a></div>
        <div><strong>Detected at:</strong> ${new Date().toLocaleString()}</div>
      </div>
      <p>An incident has been automatically created. Check the dashboard for details.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/sites/${site.id}" class="btn btn-red">View Site</a>
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `🔴 [DOWN] ${site.name} is not responding`,
    html,
  });
}

export async function sendRecoverAlert(to: string, site: SiteInfo) {
  const html = baseTemplate(`
    <div class="header" style="border-top: 4px solid #22c55e;">
      <h1>🟢 Site Recovered — ${site.name}</h1>
    </div>
    <div class="body">
      <p>Good news! <strong>${site.name}</strong> is back online and responding normally.</p>
      <div class="meta">
        <div><strong>Site:</strong> ${site.name}</div>
        <div><strong>URL:</strong> <a href="${site.url}">${site.url}</a></div>
        <div><strong>Recovered at:</strong> ${new Date().toLocaleString()}</div>
      </div>
      <p>Open incidents for this site have been automatically resolved.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/sites/${site.id}" class="btn btn-green">View Site</a>
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `🟢 [RECOVERED] ${site.name} is back online`,
    html,
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
