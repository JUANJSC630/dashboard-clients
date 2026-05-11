"use client";

import { useState } from "react";
import { Site, Client } from "@prisma/client";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCreateSite } from "../FormCreateSite/FormCreateSite";

type PartialClient = Pick<
  Client,
  "id" | "firstName" | "lastName" | "businessName"
>;

interface HeaderSitesProps {
  sites: Site[];
  clients: PartialClient[];
}

export function HeaderSites({ sites, clients }: HeaderSitesProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-semibold">Sites</h2>
        <p className="text-sm text-muted-foreground">
          {sites.length} site{sites.length !== 1 ? "s" : ""} tracked
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Globe className="mr-2 size-4" />
            New Site
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Site</DialogTitle>
          </DialogHeader>
          <FormCreateSite clients={clients} onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
