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
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { FormCreateCustomer } from "../FormCreateCustomer";

export function HeaderCompanies() {
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl">List of companies</h2>
      <Dialog open={isOpenModalCreate} onOpenChange={setIsOpenModalCreate}>
        <DialogTrigger asChild>
          <Button>Create company</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create Customer</DialogTitle>
            <DialogDescription>
              Create an configure your customer
            </DialogDescription>
          </DialogHeader>

          <FormCreateCustomer setOpenModalCreate={setIsOpenModalCreate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
