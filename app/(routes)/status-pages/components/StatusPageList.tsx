"use client";

import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";
import { SiteStatus } from "@prisma/client";

type StatusPage = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  brandColor: string;
  components: { id: string; siteId: string; displayName: string }[];
  scheduledMaintenances: { id: string; title: string }[];
  createdAt: Date;
};

type SiteOption = {
  id: string;
  name: string;
  status: SiteStatus;
};

export function StatusPageList({
  statusPages,
  sites,
}: {
  statusPages: StatusPage[];
  sites: SiteOption[];
}) {
  const { refresh } = useRouter();

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/status-page/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Status page deleted" });
      refresh();
    } catch {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const togglePublic = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/status-page/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublic }),
      });
      if (!res.ok) throw new Error();
      toast({ title: isPublic ? "Page hidden" : "Page published" });
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  if (statusPages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Globe className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold mb-1">No status pages yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Create a public status page to give your clients real-time visibility
          into the health of their services — like GitHub Status or
          Downdetector.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {statusPages.map((page) => (
        <div
          key={page.id}
          className="bg-background rounded-lg border shadow-sm overflow-hidden"
        >
          {/* Color bar */}
          <div
            className="h-1.5"
            style={{ backgroundColor: page.brandColor }}
          />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base">{page.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  /status/{page.slug}
                </p>
              </div>
              <Badge variant={page.isPublic ? "default" : "secondary"}>
                {page.isPublic ? "Public" : "Hidden"}
              </Badge>
            </div>

            {page.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {page.description}
              </p>
            )}

            {/* Components count */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Globe className="size-3.5" />
                {page.components.length} component
                {page.components.length !== 1 && "s"}
              </span>
              {page.scheduledMaintenances.length > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {page.scheduledMaintenances.length} maintenance
                </span>
              )}
            </div>

            {/* Component chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {page.components.map((comp) => {
                const site = sites.find((s) => s.id === comp.siteId);
                return (
                  <span
                    key={comp.id}
                    className="inline-flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-md"
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        site?.status === "ACTIVE"
                          ? "bg-green-500"
                          : site?.status === "DOWN"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    {comp.displayName}
                  </span>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t">
              {page.isPublic && (
                <a
                  href={`${appUrl}/status/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <ExternalLink className="size-3.5 mr-1.5" />
                    View
                  </Button>
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePublic(page.id, page.isPublic)}
              >
                {page.isPublic ? (
                  <>
                    <EyeOff className="size-3.5 mr-1.5" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5 mr-1.5" />
                    Publish
                  </>
                )}
              </Button>
              <div className="ml-auto">
                <ConfirmDialog
                  trigger={
                    <Button variant="ghost" size="icon" className="size-8">
                      <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  }
                  title="Delete status page?"
                  description="This will permanently delete this status page and all its components."
                  confirmLabel="Delete"
                  onConfirm={() => onDelete(page.id)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
