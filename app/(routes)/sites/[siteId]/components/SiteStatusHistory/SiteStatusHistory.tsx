import { SiteStatusLog, SiteStatus } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusVariant: Record<
  SiteStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  DOWN: "destructive",
  MAINTENANCE: "outline",
};

interface SiteStatusHistoryProps {
  logs: SiteStatusLog[];
}

export function SiteStatusHistory({ logs }: SiteStatusHistoryProps) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Status History</h3>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No status changes recorded yet.
        </p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[log.from]} className="text-xs">
                  {log.from}
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant={statusVariant[log.to]} className="text-xs">
                  {log.to}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(log.changedAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
