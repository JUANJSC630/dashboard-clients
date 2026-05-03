"use client";

import { useState } from "react";
import { Client, Site } from "@prisma/client";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCreateClient } from "../FormCreateClient/FormCreateClient";

type ClientWithSites = Client & { sites: Pick<Site, "id" | "status">[] };

interface HeaderClientsProps {
  clients: ClientWithSites[];
}

export function HeaderClients({ clients }: HeaderClientsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">Clients</h2>
        <p className="text-sm text-muted-foreground">
          {clients.length} client{clients.length !== 1 ? "s" : ""} registered
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Users className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <FormCreateClient onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
