"use client";

import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Navbar from "@/components/Navbar/Navbar";
import { useSidebar } from "./sidebar-context";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex w-full h-full">
      <div
        className={cn(
          "hidden xl:block h-full xl:fixed transition-[width] duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-80",
        )}
      >
        <Sidebar />
      </div>
      <div
        className={cn(
          "w-full transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "xl:ml-16" : "xl:ml-80",
        )}
      >
        <div className="bg-background shadow-md p-4">
          <Navbar />
        </div>
        <div className="p-6 bg-[#fafbfc] dark:bg-secondary">{children}</div>
      </div>
    </div>
  );
}
