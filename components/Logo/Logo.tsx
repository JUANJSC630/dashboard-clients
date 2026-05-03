"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/Sidebar/sidebar-context";

export default function Logo() {
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        "min-h-20 h-20 flex items-center border-b cursor-pointer gap-2 transition-all duration-300",
        isCollapsed ? "justify-center px-3" : "px-6",
      )}
      onClick={() => router.push("/")}
    >
      <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
      {!isCollapsed && (
        <h1 className="text-xl font-bold whitespace-nowrap">Word Code</h1>
      )}
    </div>
  );
}
