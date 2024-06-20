"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarItemProps } from "./SidebarItem.types";

export function SidebarItem(props: SidebarItemProps) {
  const { item } = props;
  const { href, icon: Icon, label } = item;
  const pathname = usePathname();
  const activePath = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        `flex gap-x-2 mt-2 p-2 rounded light:text-slate-700 dark:text-white text-sm items-center hover:bg-slate-300/20 cursor-pointer`,
        activePath && "bg-slate-300/20",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1} />
      {label}
    </Link>
  );
}
