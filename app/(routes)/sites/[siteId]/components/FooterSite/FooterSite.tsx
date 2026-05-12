"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

export function FooterSite({ siteId }: { siteId: string }) {
  const { push, refresh } = useRouter();

  const onDelete = async () => {
    try {
      const res = await fetch(`/api/site/${siteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Site deleted" });
      push("/sites");
      refresh();
    } catch {
      toast({ title: "Error deleting site", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-2 text-destructive">
        Danger Zone
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Deleting this site removes all related contacts, billing records, and
        incidents.
      </p>
      <ConfirmDialog
        trigger={
          <Button variant="destructive" className="w-full">
            <Trash className="mr-2 size-4" />
            Delete Site
          </Button>
        }
        title="Delete site?"
        description="This will permanently delete the site along with all contacts, billing records, and incidents. This action cannot be undone."
        confirmLabel="Delete Site"
        onConfirm={onDelete}
      />
    </div>
  );
}
