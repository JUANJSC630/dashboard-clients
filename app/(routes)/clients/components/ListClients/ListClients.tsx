import { Client, Site, SiteStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ClientWithSites = Client & { sites: Pick<Site, "id" | "status">[] };

interface ListClientsProps {
  clients: ClientWithSites[];
}

const statusColor: Record<SiteStatus, string> = {
  ACTIVE: "bg-green-500",
  PAUSED: "bg-yellow-500",
  DOWN: "bg-red-500",
  MAINTENANCE: "bg-blue-500",
};

export function ListClients({ clients }: ListClientsProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No clients yet. Add your first client to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {clients.map((client) => {
        const downCount = client.sites.filter(
          (s) => s.status === "DOWN",
        ).length;
        return (
          <Card key={client.id}>
            <CardContent className="p-6 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg">
                    {client.firstName} {client.lastName}
                  </p>
                  {downCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {downCount} down
                    </Badge>
                  )}
                </div>
                {client.businessName && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {client.businessName}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">{client.email}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
                <div className="flex items-center gap-1 pt-1">
                  {client.sites.map((site) => (
                    <span
                      key={site.id}
                      className={`w-2 h-2 rounded-full ${statusColor[site.status]}`}
                      title={site.status}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {client.sites.length} site
                    {client.sites.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <Link href={`/clients/${client.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
