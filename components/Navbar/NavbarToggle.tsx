"use client";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/Sidebar/sidebar-context";

export function NavbarToggle() {
  const { toggle } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="size-5" />
    </Button>
  );
}
