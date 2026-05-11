"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function DuplicateSiteButton({ siteId }: { siteId: string }) {
  const { push, refresh } = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/site/${siteId}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      toast({
        title: "Site duplicated",
        description: `Created "${data.name}"`,
      });
      push(`/sites/${data.id}`);
      refresh();
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
        <Loader2 className="size-4 mr-1.5 animate-spin" />
      ) : (
        <Copy className="size-4 mr-1.5" />
      )}
      Duplicate
    </Button>
  );
}
