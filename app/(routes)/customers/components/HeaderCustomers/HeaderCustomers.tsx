"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FormCreateCustomers } from "../FormCreateCustomers";

export function HeaderCustomers() {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl">List of companies</h2>
      <Dialog open={isOpenModalCreate} onOpenChange={setIsOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Add new customer</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <FormCreateCustomers setOpenModalCreate={setIsOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
