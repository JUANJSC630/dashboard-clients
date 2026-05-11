import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
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

export function SiteHeader({ site }: { site: Site }) {
  return (
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
          {site.lastCheckedAt && (
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
              Last checked: {new Date(site.lastCheckedAt).toLocaleString()}
            </span>
          )}
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
        <SitePingButton siteId={site.id} siteUrl={site.url} />
        <DuplicateSiteButton siteId={site.id} />
      </div>
    </div>
  );
}
