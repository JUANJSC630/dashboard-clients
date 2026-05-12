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
          isCollapsed ? "w-16" : "w-72",
        )}
      >
        <Sidebar />
      </div>
      <div
        className={cn(
          "w-full transition-[margin] duration-300 ease-in-out",
          isCollapsed ? "xl:ml-16" : "xl:ml-72",
        )}
      >
        <Navbar />
        <div className="p-6 bg-[#f7f8fa] dark:bg-secondary/40 min-h-[calc(100vh-5rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
