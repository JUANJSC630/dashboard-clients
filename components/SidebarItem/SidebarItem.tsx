"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarItemProps } from "./SidebarItem.types";
import { useSidebar } from "@/components/Sidebar/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SidebarItem(props: SidebarItemProps) {
  const { item } = props;
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const activePath = pathname === href;
  const { isCollapsed } = useSidebar();

  const link = (
    <Link
      href={href}
      className={cn(
        "flex gap-x-2 mt-2 p-2 rounded text-sm items-center hover:bg-slate-300/20 cursor-pointer transition-colors",
        activePath && "bg-slate-300/20",
        isCollapsed && "justify-center",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
