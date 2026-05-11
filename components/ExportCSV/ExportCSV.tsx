"use client";

import { useCallback } from "react";
import Papa from "papaparse";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ExportCSVProps<T extends object> {
  data: T[];
  filename: string;
  label?: string;
}

export function ExportCSV<T extends object>({
  data,
  filename,
  label = "Export CSV",
}: ExportCSVProps<T>) {
  const handleExport = useCallback(() => {
    if (data.length === 0) return;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data, filename]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={data.length === 0}
    >
      <Download className="size-4 mr-1.5" />
      {label}
    </Button>
  );
}
