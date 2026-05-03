"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/SidebarItem";
import { dataGeneralSidebar, dataToolsSidebar } from "./SidebarRoutes.data";
import { useSidebar } from "@/components/Sidebar/sidebar-context";
import { cn } from "@/lib/utils";

export function SidebarRoutes() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className={cn("p-2", !isCollapsed && "md:p-6")}>
          {!isCollapsed && (
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              General
            </p>
          )}
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className={cn("p-2", !isCollapsed && "md:p-6")}>
          {!isCollapsed && (
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
              Tools
            </p>
          )}
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
      </div>
      {!isCollapsed && (
        <div>
          <Separator />
          <div className="p-6">
            <Button variant="outline" className="w-full">
              Upgrade Plan
            </Button>
          </div>
          <Separator />
          <footer className="mt-3 p-3 text-center">
            <p className="text-xs text-slate-500">© 2024 All rights reserved</p>
          </footer>
        </div>
      )}
    </div>
  );
}
