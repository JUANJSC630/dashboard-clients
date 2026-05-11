"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface SitePingButtonProps {
  siteId: string;
  siteUrl: string;
}

export function SitePingButton({ siteId, siteUrl }: SitePingButtonProps) {
  const { refresh } = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePing = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/site/${siteId}/ping`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const isUp = data.status === "ACTIVE";
      toast({
        title: isUp ? "Site is UP" : "Site is DOWN",
        description: isUp
          ? `Responded in ${data.latencyMs}ms`
          : `${siteUrl} did not respond`,
        variant: isUp ? "default" : "destructive",
      });
      refresh();
    } catch {
      toast({ title: "Ping failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePing} disabled={loading}>
      {loading ? (
        <Loader2 className="size-4 mr-1.5 animate-spin" />
      ) : (
        <Wifi className="size-4 mr-1.5" />
      )}
      Ping
    </Button>
  );
}
