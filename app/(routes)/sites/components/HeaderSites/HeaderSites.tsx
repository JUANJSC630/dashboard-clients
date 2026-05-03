"use client";

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

type PartialClient = Pick<Client, "id" | "firstName" | "lastName" | "businessName">;

interface HeaderSitesProps {
  sites: Site[];
  clients: PartialClient[];
}

export function HeaderSites({ sites, clients }: HeaderSitesProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">Sites</h2>
        <p className="text-sm text-muted-foreground">
          {sites.length} site{sites.length !== 1 ? "s" : ""} tracked
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Globe className="mr-2 h-4 w-4" />
            New Site
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Site</DialogTitle>
          </DialogHeader>
          <FormCreateSite clients={clients} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
