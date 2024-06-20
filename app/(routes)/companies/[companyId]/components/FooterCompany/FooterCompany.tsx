"use client";

import axios from "axios";
import { FooterCompanyProps } from "./FooterCompany.types";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function FooterCompany(props: FooterCompanyProps) {
  const { companyId } = props;
  const router = useRouter();

  const onDeleteCompany = async () => {
    try {
      axios.delete(`/api/company/${companyId}`);
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
      router.push("/companies");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the company",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-end mt-5">
      <Button variant={"destructive"} onClick={onDeleteCompany}>
        <Trash className="w-4 h-4 mr-2" />
        Remove company
      </Button>
    </div>
  );
}
