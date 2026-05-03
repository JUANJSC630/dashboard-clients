"use client";

import { ExportCSV } from "@/components/ExportCSV";

interface BillingExportRow {
  site: string;
  client: string;
  amount: number;
  currency: string;
  cycle: string;
  nextDueDate: string;
  status: string;
}

export function BillingExportButton({ rows }: { rows: BillingExportRow[] }) {
  return <ExportCSV data={rows} filename="billing" label="Export CSV" />;
}
