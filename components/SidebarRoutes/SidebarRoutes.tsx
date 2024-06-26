"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SidebarItem } from "@/components/SidebarItem";
import {
  dataGeneralSidebar,
  // dataSupportSidebar,
  dataToolsSidebar,
} from "./SidebarRoutes.data";

export function SidebarRoutes() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="p-2 md:p-6">
          <p>General</p>
          {dataGeneralSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        <div className="p-2 md:p-6">
          <p>Tools</p>
          {dataToolsSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div>
        <Separator />
        {/* <div className="p-2 md:p-4">
          <p className="text-slate-500">Support</p>
          {dataSupportSidebar.map((item) => (
            <SidebarItem key={item.label} item={item} />
          ))}
        </div> */}
      </div>
      <div>
        <div className="text-center p-6">
          <Button variant="outline" className="w-full">
            Upgrade Plan
          </Button>
        </div>
        <Separator />
        <footer className="mt-3 p-3 text-center">
          <p className="text-xs text-slate-500">© 2024 All rights reserved</p>
        </footer>
      </div>
    </div>
  );
}
