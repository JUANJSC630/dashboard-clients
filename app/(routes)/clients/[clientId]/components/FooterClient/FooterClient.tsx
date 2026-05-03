"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FooterClient({ clientId }: { clientId: string }) {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/client/${clientId}`);
      toast({ title: "Client deleted" });
      router.push("/clients");
      router.refresh();
    } catch {
      toast({ title: "Error deleting client", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-2 text-destructive">
        Danger Zone
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Deleting this client is permanent and cannot be undone.
      </p>
      <Button variant="destructive" onClick={onDelete} className="w-full">
        <Trash className="mr-2 h-4 w-4" />
        Delete Client
      </Button>
    </div>
  );
}
