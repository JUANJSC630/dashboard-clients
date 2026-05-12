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
        "flex gap-x-2.5 mt-1 px-3 py-2 rounded-md text-sm items-center cursor-pointer transition-colors duration-150",
        "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]",
        activePath && "bg-foreground/[0.07] text-foreground font-medium",
        isCollapsed && "justify-center w-10 h-10 mx-auto px-0",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          activePath ? "opacity-100" : "opacity-60",
        )}
        strokeWidth={1.75}
      />
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
