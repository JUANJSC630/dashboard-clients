"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import {
  Incident,
  IncidentPriority,
  IncidentStatus,
  IncidentType,
  IncidentUpdate,
  IncidentUpdateStatus,
} from "@prisma/client";
import {
  Plus,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  MessageSquarePlus,
} from "lucide-react";
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
  "ERROR",
  "DOWNTIME",
  "PERFORMANCE",
  "DEPLOYMENT",
  "BILLING",
  "REQUEST",
  "OTHER",
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

const UPDATE_STATUSES: IncidentUpdateStatus[] = [
  "INVESTIGATING",
  "IDENTIFIED",
  "MONITORING",
  "RESOLVED",
];

const updateStatusColor: Record<IncidentUpdateStatus, string> = {
  INVESTIGATING: "text-yellow-600",
  IDENTIFIED: "text-orange-600",
  MONITORING: "text-blue-600",
  RESOLVED: "text-green-600",
};

export function SiteIncidents({
  incidents,
  siteId,
}: {
  incidents: (Incident & { updates?: IncidentUpdate[] })[];
  siteId: string;
}) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: "INVESTIGATING" as IncidentUpdateStatus,
    message: "",
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as IncidentPriority,
    type: "OTHER" as IncidentType,
  });

  const onAdd = async () => {
    try {
      const res = await fetch(`/api/site/${siteId}/incident`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Incident created" });
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM",
        type: "OTHER",
      });
      setOpen(false);
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/incident/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Incident deleted" });
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/incident/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "RESOLVED",
          resolvedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Incident resolved" });
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onStatusChange = async (id: string, status: IncidentStatus) => {
    try {
      const res = await fetch(`/api/incident/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(status === "RESOLVED"
            ? { resolvedAt: new Date().toISOString() }
            : {}),
        }),
      });
      if (!res.ok) throw new Error();
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onPostUpdate = async (incidentId: string) => {
    if (!updateForm.message.trim()) {
      toast({ title: "Message required", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/incident/${incidentId}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      });
      if (!res.ok) throw new Error();
      toast({ title: "Update posted" });
      setUpdateForm({ status: "INVESTIGATING", message: "" });
      setUpdateOpen(null);
      refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Incidents</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4 mr-1" />
          Add
        </Button>
      </div>

      {open && (
        <div className="space-y-2 mb-4 p-4 border rounded-md bg-muted/30">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Textarea
            placeholder="Description (optional)"
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={form.priority}
              onValueChange={(v) =>
                setForm((prev) => ({
                  ...prev,
                  priority: v as IncidentPriority,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setForm((prev) => ({ ...prev, type: v as IncidentType }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
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
          <p className="text-sm text-muted-foreground">
            No incidents recorded.
          </p>
        )}
        {incidents.map((inc) => (
          <div key={inc.id}>
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <AlertTriangle
                  className={`size-4 mt-0.5 shrink-0 ${priorityColor[inc.priority]}`}
                />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{inc.title}</p>
                  {inc.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {inc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {inc.type}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span
                      className="text-xs text-muted-foreground"
                      suppressHydrationWarning
                    >
                      {new Date(inc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Select
                  value={inc.status}
                  onValueChange={(v) =>
                    onStatusChange(inc.id, v as IncidentStatus)
                  }
                >
                  <SelectTrigger className="h-7 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN" className="text-xs">
                      <Badge variant="destructive" className="text-xs">
                        OPEN
                      </Badge>
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS" className="text-xs">
                      <Badge variant="outline" className="text-xs">
                        IN PROGRESS
                      </Badge>
                    </SelectItem>
                    <SelectItem value="RESOLVED" className="text-xs">
                      <Badge variant="default" className="text-xs">
                        RESOLVED
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {inc.status !== "RESOLVED" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-green-600"
                    onClick={() => onResolve(inc.id)}
                    title="Mark resolved"
                  >
                    <CheckCircle2 className="size-3.5" />
                  </Button>
                )}
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  }
                  title="Delete incident?"
                  description="This incident will be permanently deleted."
                  confirmLabel="Delete"
                  onConfirm={() => onDelete(inc.id)}
                />
              </div>
            </div>

            {/* Post Update button & timeline */}
            {inc.status !== "RESOLVED" && (
              <div className="ml-6 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-muted-foreground"
                  onClick={() =>
                    setUpdateOpen(updateOpen === inc.id ? null : inc.id)
                  }
                >
                  <MessageSquarePlus className="size-3.5 mr-1" />
                  Post Update
                </Button>

                {updateOpen === inc.id && (
                  <div className="mt-2 p-3 border rounded-md bg-muted/30 space-y-2">
                    <Select
                      value={updateForm.status}
                      onValueChange={(v) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          status: v as IncidentUpdateStatus,
                        }))
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UPDATE_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="What's the current situation?"
                      rows={2}
                      className="text-xs"
                      value={updateForm.message}
                      onChange={(e) =>
                        setUpdateForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                    />
                    <Button
                      size="sm"
                      className="w-full h-7 text-xs"
                      onClick={() => onPostUpdate(inc.id)}
                    >
                      Post Update
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Existing updates timeline */}
            {inc.updates && inc.updates.length > 0 && (
              <div className="ml-6 mt-2 space-y-1.5">
                {inc.updates.map((u) => (
                  <div key={u.id} className="flex items-start gap-2 text-xs">
                    <span
                      className={`font-semibold shrink-0 ${updateStatusColor[u.status]}`}
                    >
                      {u.status}
                    </span>
                    <span className="text-muted-foreground">{u.message}</span>
                    <span
                      className="text-muted-foreground/60 ml-auto shrink-0"
                      suppressHydrationWarning
                    >
                      {new Date(u.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
