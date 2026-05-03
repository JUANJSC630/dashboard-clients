"use client";

import { ExportCSV } from "@/components/ExportCSV";

interface IncidentExportRow {
  title: string;
  site: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
}

export function IncidentsExportButton({ rows }: { rows: IncidentExportRow[] }) {
  return <ExportCSV data={rows} filename="incidents" label="Export CSV" />;
}
