"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/Sidebar/sidebar-context";

export default function Logo() {
  const { isCollapsed } = useSidebar();

  return (
    <Link
      href="/"
      className={cn(
        "h-16 flex items-center border-b gap-2.5 transition-all duration-300 hover:bg-foreground/[0.03]",
        isCollapsed ? "justify-center px-3" : "px-5",
      )}
    >
      <Image src="/logo.svg" alt="Logo" width={26} height={26} priority />
      {!isCollapsed && (
        <span className="text-sm font-semibold tracking-tight whitespace-nowrap">
          Word Code
        </span>
      )}
    </Link>
  );
}
