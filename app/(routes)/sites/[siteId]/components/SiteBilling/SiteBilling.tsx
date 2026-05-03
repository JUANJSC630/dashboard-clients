"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Billing, BillingCycle, BillingStatus, Currency } from "@prisma/client";
import { Plus, DollarSign, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const CYCLES: BillingCycle[] = ["MONTHLY", "ANNUAL", "ONE_TIME"];
const STATUSES: BillingStatus[] = ["PENDING", "PAID", "OVERDUE"];
const CURRENCIES: Currency[] = ["USD", "COP", "EUR", "MXN", "ARS", "BRL"];

const statusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

export function SiteBilling({
  billings,
  siteId,
  clientId,
}: {
  billings: Billing[];
  siteId: string;
  clientId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    currency: "USD" as Currency,
    cycle: "MONTHLY" as BillingCycle,
    nextDueDate: "",
    notes: "",
  });

  const onAdd = async () => {
    try {
      await axios.post(`/api/site/${siteId}/billing`, {
        ...form,
        amount: parseFloat(form.amount),
        clientId,
      });
      toast({ title: "Billing record added" });
      setForm({
        amount: "",
        currency: "USD",
        cycle: "MONTHLY",
        nextDueDate: "",
        notes: "",
      });
      setOpen(false);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/billing/${id}`);
      toast({ title: "Record deleted" });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const onStatusChange = async (id: string, status: BillingStatus) => {
    try {
      await axios.patch(`/api/billing/${id}`, { status });
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Billing</h3>
        <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      {open && (
        <div className="space-y-2 mb-4 p-4 border rounded-md bg-muted/30">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Select
              value={form.currency}
              onValueChange={(v) => setForm({ ...form, currency: v as Currency })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select
            value={form.cycle}
            onValueChange={(v) => setForm({ ...form, cycle: v as BillingCycle })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CYCLES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={form.nextDueDate}
            onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
          />
          <Input
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Button size="sm" className="w-full" onClick={onAdd}>
            Save Record
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {billings.length === 0 && (
          <p className="text-sm text-muted-foreground">No billing records yet.</p>
        )}
        {billings.map((b) => (
          <div key={b.id}>
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">
                    {b.amount} {b.currency}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {b.cycle}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Due: {new Date(b.nextDueDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={b.status}
                  onValueChange={(v) => onStatusChange(b.id, v as BillingStatus)}
                >
                  <SelectTrigger className="h-7 w-28 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        <Badge variant={statusVariant[s]} className="text-xs">
                          {s}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(b.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <Separator className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
