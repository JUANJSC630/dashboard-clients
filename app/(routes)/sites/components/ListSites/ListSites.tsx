import {
  Site,
  Client,
  Incident,
  Billing,
  Platform,
  SiteStatus,
} from "@prisma/client";
import Link from "next/link";
import {
  Globe,
  ExternalLink,
  AlertTriangle,
  CreditCard,
  ServerOff,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type SiteWithRelations = Site & {
  client: Pick<Client, "firstName" | "lastName" | "businessName">;
  incidents: Pick<Incident, "id">[];
  billings: Pick<Billing, "id" | "nextDueDate" | "status">[];
};

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

export function ListSites({ sites }: { sites: SiteWithRelations[] }) {
  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3 text-muted-foreground">
        <ServerOff className="size-10 opacity-30" />
        <p className="font-medium">No sites found</p>
        <p className="text-sm">Add your first site or adjust your filters.</p>
      </div>
    );
  }

  const overdueCount = (billings: SiteWithRelations["billings"]) =>
    billings.filter((b) => b.status === "OVERDUE").length;

  return (
    <div className="space-y-3">
      {sites.map((site) => (
        <div
          key={site.id}
          className="bg-background border rounded-lg p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-2 h-10 rounded-full shrink-0 ${
                site.status === "DOWN"
                  ? "bg-red-500"
                  : site.status === "MAINTENANCE"
                    ? "bg-blue-500"
                    : site.status === "PAUSED"
                      ? "bg-yellow-500"
                      : "bg-green-500"
              }`}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{site.name}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${platformColors[site.platform]}`}
                >
                  {site.platform}
                </span>
                <Badge variant={statusVariant[site.status]} className="text-xs">
                  {site.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Globe className="size-3 text-muted-foreground shrink-0" />
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline truncate"
                >
                  {site.url}
                </a>
                <ExternalLink className="size-3 text-muted-foreground shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {site.client.businessName ??
                  `${site.client.firstName} ${site.client.lastName}`}
                {site.techStack && ` · ${site.techStack}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {site.uptimePercent != null && (
              <span
                className={`text-xs font-medium ${
                  site.uptimePercent >= 99
                    ? "text-green-600"
                    : site.uptimePercent >= 95
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {site.uptimePercent.toFixed(1)}%
              </span>
            )}
            {site.sslDaysLeft != null && site.sslDaysLeft <= 30 && (
              <span className="flex items-center gap-0.5 text-xs">
                {site.sslDaysLeft <= 0 ? (
                  <ShieldAlert className="size-3.5 text-red-500" />
                ) : (
                  <ShieldAlert className="size-3.5 text-yellow-500" />
                )}
              </span>
            )}
            {site.sslDaysLeft != null && site.sslDaysLeft > 30 && (
              <Shield className="size-3.5 text-green-500" />
            )}
            {site.incidents.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <AlertTriangle className="size-3.5" />
                {site.incidents.length}
              </div>
            )}
            {overdueCount(site.billings) > 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-500">
                <CreditCard className="size-3.5" />
                overdue
              </div>
            )}
            <Link href={`/sites/${site.id}`}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
