import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  ShieldAlert,
  Clock,
  Settings,
  Bell,
} from "lucide-react";
import { Site, Platform, SiteStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SitePingButton } from "./SitePingButton/SitePingButton";
import { DuplicateSiteButton } from "./DuplicateSiteButton/DuplicateSiteButton";

const platformColors: Record<Platform, string> = {
  VERCEL: "bg-black text-white",
  RAILWAY: "bg-purple-600 text-white",
  NETLIFY: "bg-teal-500 text-white",
  RENDER: "bg-green-600 text-white",
  HOSTINGER: "bg-violet-600 text-white",
  CLOUDFLARE: "bg-orange-500 text-white",
  HEROKU: "bg-indigo-600 text-white",
  DIGITALOCEAN: "bg-blue-500 text-white",
  CUSTOM: "bg-slate-500 text-white",
};

const statusVariant: Record<
  SiteStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  DOWN: "destructive",
  MAINTENANCE: "outline",
};

export function SiteHeader({
  site,
  actions,
}: {
  site: Site;
  actions?: React.ReactNode;
}) {
  const sslOk = site.sslDaysLeft != null && site.sslDaysLeft > 30;
  const sslWarn =
    site.sslDaysLeft != null && site.sslDaysLeft <= 30 && site.sslDaysLeft > 0;
  const sslExpired = site.sslDaysLeft != null && site.sslDaysLeft <= 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Link href="/sites">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 size-4" />
              Back to Sites
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <h2 className="text-2xl font-semibold">{site.name}</h2>
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${platformColors[site.platform]}`}
            >
              {site.platform}
            </span>
            <Badge variant={statusVariant[site.status]}>{site.status}</Badge>
          </div>
          {site.url && (
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
            >
              {site.url}
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <SitePingButton siteId={site.id} siteUrl={site.url} />
          <DuplicateSiteButton siteId={site.id} />
        </div>
      </div>

      {/* Metrics bar */}
      <div className="flex items-center gap-6 flex-wrap text-xs text-muted-foreground border rounded-lg px-4 py-2.5 bg-muted/30">
        {site.uptimePercent != null && (
          <span className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${
                site.uptimePercent >= 99
                  ? "bg-green-500"
                  : site.uptimePercent >= 95
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            Uptime (24h):{" "}
            <strong className="text-foreground">
              {site.uptimePercent.toFixed(1)}%
            </strong>
          </span>
        )}
        {site.sslDaysLeft != null && (
          <span className="flex items-center gap-1.5">
            {sslOk && <Shield className="size-3.5 text-green-500" />}
            {sslWarn && <ShieldAlert className="size-3.5 text-yellow-500" />}
            {sslExpired && <ShieldAlert className="size-3.5 text-red-500" />}
            SSL:{" "}
            <strong
              className={
                sslExpired
                  ? "text-red-500"
                  : sslWarn
                    ? "text-yellow-600"
                    : "text-foreground"
              }
            >
              {sslExpired ? "Expired" : `${site.sslDaysLeft}d left`}
            </strong>
            {site.sslExpiresAt && (
              <span
                className="text-muted-foreground/70"
                suppressHydrationWarning
              >
                (exp. {new Date(site.sslExpiresAt).toLocaleDateString()})
              </span>
            )}
          </span>
        )}
        {site.lastCheckedAt && (
          <span className="flex items-center gap-1.5" suppressHydrationWarning>
            <Clock className="size-3.5" />
            Last checked: {new Date(site.lastCheckedAt).toLocaleString()}
          </span>
        )}
        {site.checkIntervalMin && (
          <span className="flex items-center gap-1.5">
            Every {site.checkIntervalMin}min
          </span>
        )}
      </div>
    </div>
  );
}
