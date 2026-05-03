"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface SitePingButtonProps {
  siteId: string;
  siteUrl: string;
}

export function SitePingButton({ siteId, siteUrl }: SitePingButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePing = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`/api/site/${siteId}/ping`);
      const isUp = data.status === "ACTIVE";
      toast({
        title: isUp ? "Site is UP" : "Site is DOWN",
        description: isUp
          ? `Responded in ${data.latencyMs}ms`
          : `${siteUrl} did not respond`,
        variant: isUp ? "default" : "destructive",
      });
      router.refresh();
    } catch {
      toast({ title: "Ping failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePing} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
      ) : (
        <Wifi className="h-4 w-4 mr-1.5" />
      )}
      Ping
    </Button>
  );
}
