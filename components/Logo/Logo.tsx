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
        "min-h-20 h-20 flex items-center border-b gap-2 transition-all duration-300",
        isCollapsed ? "justify-center px-3" : "px-6",
      )}
    >
      <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
      {!isCollapsed && (
        <h1 className="text-xl font-semibold whitespace-nowrap">Word Code</h1>
      )}
    </Link>
  );
}
