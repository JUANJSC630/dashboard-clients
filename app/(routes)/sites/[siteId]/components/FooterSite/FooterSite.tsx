"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FooterSite({ siteId }: { siteId: string }) {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/site/${siteId}`);
      toast({ title: "Site deleted" });
      router.push("/sites");
      router.refresh();
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
      <Button variant="destructive" onClick={onDelete} className="w-full">
        <Trash className="mr-2 h-4 w-4" />
        Delete Site
      </Button>
    </div>
  );
}
