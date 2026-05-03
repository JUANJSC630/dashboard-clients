"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Incident,
  IncidentPriority,
  IncidentStatus,
  IncidentType,
} from "@prisma/client";
import { Plus, AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

const PRIORITIES: IncidentPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const TYPES: IncidentType[] = [
  "ERROR", "DOWNTIME", "PERFORMANCE", "DEPLOYMENT", "BILLING", "REQUEST", "OTHER",
];

const priorityColor: Record<IncidentPriority, string> = {
  LOW: "text-green-600",
  MEDIUM: "text-yellow-600",
  HIGH: "text-orange-600",
  CRITICAL: "text-red-600",
};

const statusVariant: Record<
  IncidentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  OPEN: "destructive",
  IN_PROGRESS: "outline",
  RESOLVED: "default",
};

export function SiteIncidents({
  incidents,
  siteId,
}: {
  incidents: Incident[];
  siteId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as IncidentPriority,
    type: "OTHER" as IncidentType,
  });

  const onAdd = async () => {
    try {
      await axios.post(`/api/site/${siteId}/incident`, form);
      toast({ title: "Incident created" });
      setForm({ title: "", description: "", priority: "MEDIUM", type: "OTHER" });
      setOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/incident/${id}`);
      toast({ title: "Incident deleted" });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onResolve = async (id: string) => {
    try {
      await axios.patch(`/api/incident/${id}`, {
        status: "RESOLVED",
        resolvedAt: new Date().toISOString(),
      });
      toast({ title: "Incident resolved" });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onStatusChange = async (id: string, status: IncidentStatus) => {
    try {
      await axios.patch(`/api/incident/${id}`, {
        status,
        ...(status === "RESOLVED" ? { resolvedAt: new Date().toISOString() } : {}),
      });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Incidents</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {open && (
        <div className="space-y-2 mb-4 p-4 border rounded-md bg-muted/30">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={form.priority}
              onValueChange={(v) => setForm({ ...form, priority: v as IncidentPriority })}
            >
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.type}
              onValueChange={(v) => setForm({ ...form, type: v as IncidentType })}
            >
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="w-full" onClick={onAdd}>
            Save Incident
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {incidents.length === 0 && (
          <p className="text-sm text-muted-foreground">No incidents recorded.</p>
        )}
        {incidents.map((inc) => (
          <div key={inc.id}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 shrink-0 ${priorityColor[inc.priority]}`}
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{inc.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{inc.type}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Select
                  value={inc.status}
                  onValueChange={(v) => onStatusChange(inc.id, v as IncidentStatus)}
                >
                  <SelectTrigger className="h-7 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN" className="text-xs">
                      <Badge variant="destructive" className="text-xs">OPEN</Badge>
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS" className="text-xs">
                      <Badge variant="outline" className="text-xs">IN PROGRESS</Badge>
                    </SelectItem>
                    <SelectItem value="RESOLVED" className="text-xs">
                      <Badge variant="default" className="text-xs">RESOLVED</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {inc.status !== "RESOLVED" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-green-600"
                    onClick={() => onResolve(inc.id)}
                    title="Mark resolved"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </Button>
                )}
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title="Delete incident?"
                  description="This incident will be permanently deleted."
                  confirmLabel="Delete"
                  onConfirm={() => onDelete(inc.id)}
                />
              </div>
            </div>
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
