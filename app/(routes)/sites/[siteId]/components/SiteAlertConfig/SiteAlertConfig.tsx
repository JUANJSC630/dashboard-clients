"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { SiteAlertConfig as AlertConfigType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

interface SiteAlertConfigProps {
  siteId: string;
  config: AlertConfigType | null;
}

export function SiteAlertConfig({ siteId, config }: SiteAlertConfigProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    alertEmail: config?.alertEmail ?? "",
    onDown: config?.onDown ?? true,
    onRecover: config?.onRecover ?? true,
    cooldownMinutes: config?.cooldownMinutes ?? 60,
    webhookUrl: config?.webhookUrl ?? "",
  });
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!form.alertEmail) {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await axios.post(`/api/site/${siteId}/alert-config`, {
        ...form,
        webhookUrl: form.webhookUrl || null,
      });
      toast({ title: config ? "Alert config updated" : "Alerts enabled" });
      router.refresh();
    } catch {
      toast({ title: "Error saving config", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/site/${siteId}/alert-config`);
      toast({ title: "Alerts disabled" });
      setForm({
        alertEmail: "",
        onDown: true,
        onRecover: true,
        cooldownMinutes: 60,
        webhookUrl: "",
      });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center gap-2 mb-1">
        <Bell className="h-4 w-4" />
        <h3 className="text-lg font-semibold">Alert Settings</h3>
        {config && (
          <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Receive an email when this site goes down or recovers.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="alertEmail">Notification email</Label>
          <Input
            id="alertEmail"
            type="email"
            placeholder="you@example.com"
            value={form.alertEmail}
            onChange={(e) => setForm({ ...form, alertEmail: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border accent-primary"
              checked={form.onDown}
              onChange={(e) => setForm({ ...form, onDown: e.target.checked })}
            />
            <span className="text-sm">Alert when site goes down</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border accent-primary"
              checked={form.onRecover}
              onChange={(e) => setForm({ ...form, onRecover: e.target.checked })}
            />
            <span className="text-sm">Alert when site recovers</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cooldown">Cooldown (minutes)</Label>
          <Input
            id="cooldown"
            type="number"
            min={1}
            max={1440}
            value={form.cooldownMinutes}
            onChange={(e) =>
              setForm({ ...form, cooldownMinutes: parseInt(e.target.value) || 60 })
            }
            className="w-32"
          />
          <p className="text-xs text-muted-foreground">
            Minimum time between alerts for this site.
          </p>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label htmlFor="webhook">Webhook URL (optional)</Label>
          <Input
            id="webhook"
            type="url"
            placeholder="https://hooks.slack.com/... or https://discord.com/api/webhooks/..."
            value={form.webhookUrl}
            onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Receives a POST with <code className="text-xs bg-muted px-1 rounded">{"{ event, site, timestamp }"}</code>. Compatible with Slack and Discord.
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <Button className="flex-1" onClick={onSave} disabled={saving}>
            <Bell className="h-4 w-4 mr-2" />
            {saving ? "Saving…" : config ? "Update Alerts" : "Enable Alerts"}
          </Button>
          {config && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="icon">
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                </Button>
              }
              title="Disable alerts?"
              description="Alert configuration for this site will be deleted. You can re-enable it at any time."
              confirmLabel="Disable"
              onConfirm={onDelete}
            />
          )}
        </div>

        {config?.lastAlertSentAt && (
          <p className="text-xs text-muted-foreground">
            Last alert sent:{" "}
            {new Date(config.lastAlertSentAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
