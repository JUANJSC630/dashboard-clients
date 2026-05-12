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
    <div className="flex flex-col justify-between h-full overflow-y-auto">
      <div>
        <div className={cn("px-3 py-4", !isCollapsed && "px-5")}>
          {!isCollapsed && (
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 px-3">
              General
            </p>
          )}
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </div>
        <Separator />
        <div className={cn("px-3 py-4", !isCollapsed && "px-5")}>
          {!isCollapsed && (
            <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest mb-2 px-3">
              Tools
            </p>
          )}
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.href} item={item} />
          ))}
        </div>
      </div>
      {!isCollapsed && (
        <div>
          <Separator />
          <footer className="py-3 px-5 text-center">
            <p className="text-[10px] text-muted-foreground/50">
              © {new Date().getFullYear()} Word Code
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
