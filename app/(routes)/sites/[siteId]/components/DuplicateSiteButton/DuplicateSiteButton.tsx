"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function DuplicateSiteButton({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/site/${siteId}/duplicate`);
      toast({
        title: "Site duplicated",
        description: `Created "${data.name}"`,
      });
      router.push(`/sites/${data.id}`);
      router.refresh();
    } catch {
      toast({ title: "Error duplicating site", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDuplicate}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
      ) : (
        <Copy className="h-4 w-4 mr-1.5" />
      )}
      Duplicate
    </Button>
  );
}
