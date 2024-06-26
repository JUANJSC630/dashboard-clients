"use client";

import axios from "axios";
import { FooterCustomerProps } from "./FooterCustomer.types";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FooterCustomer(props: FooterCustomerProps) {
  const { customerId } = props;
  const router = useRouter();

  

  const onDeleteCustomer = async () => {
    try {
      await axios.delete(`/api/customer/${customerId}`);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      router.push("/customers");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting customer",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-end mt-5">
      <Button variant={"destructive"} onClick={onDeleteCustomer}>
        <Trash className="w-4 h-4 mr-2" />
        Remove customer
      </Button>
    </div>
  );
}
