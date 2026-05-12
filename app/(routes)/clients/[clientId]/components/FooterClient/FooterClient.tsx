"use client";

import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog/ConfirmDialog";

export function FooterClient({ clientId }: { clientId: string }) {
  const { push, refresh } = useRouter();

  const onDelete = async () => {
    try {
      const res = await fetch(`/api/client/${clientId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: "Client deleted" });
      push("/clients");
      refresh();
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
      <ConfirmDialog
        trigger={
          <Button variant="destructive" className="w-full">
            <Trash className="mr-2 size-4" />
            Delete Client
          </Button>
        }
        title="Delete client?"
        description="This will permanently delete the client and all their associated data. This action cannot be undone."
        confirmLabel="Delete Client"
        onConfirm={onDelete}
      />
    </div>
  );
}
