import { Site, Billing, Incident, Platform, SiteStatus } from "@prisma/client";
import Link from "next/link";
import { Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SiteWithRelations = Site & {
  billings: Billing[];
  incidents: Incident[];
};

const platformLabel: Record<Platform, string> = {
  VERCEL: "Vercel",
  RAILWAY: "Railway",
  NETLIFY: "Netlify",
  RENDER: "Render",
  HOSTINGER: "Hostinger",
  CLOUDFLARE: "Cloudflare",
  HEROKU: "Heroku",
  DIGITALOCEAN: "DigitalOcean",
  CUSTOM: "Custom",
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

export function ClientSites({ sites }: { sites: SiteWithRelations[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Sites ({sites.length})</h3>
      {sites.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sites linked yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{site.name}</CardTitle>
                  <Badge variant={statusVariant[site.status]}>
                    {site.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {platformLabel[site.platform]}
                  </Badge>
                  {site.techStack && (
                    <span className="text-xs text-muted-foreground">
                      {site.techStack}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {site.url && (
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline truncate"
                  >
                    <Globe className="h-3 w-3 shrink-0" />
                    {site.url}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                )}
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>
                    {site.incidents.length} open incident
                    {site.incidents.length !== 1 ? "s" : ""}
                  </span>
                  <span>
                    {site.billings.length} billing record
                    {site.billings.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <Link href={`/sites/${site.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    View Site
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
