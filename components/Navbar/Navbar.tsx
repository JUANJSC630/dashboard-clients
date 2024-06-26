import { Menu, Search } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "@/components/SidebarRoutes/SidebarRoutes";
import { ToggleTheme } from "@/components/ToggleTheme/ToggleTheme";

export default function Navbar() {
  return (
    <nav className="flex items-center px-2 gap-x-4 md:px-6 justify-between xl:justify-end w-full bg-background border-b h-20">
      <div className="block xl:hidden">
        <Sheet>
          <SheetTrigger className="flex items-center">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left">
            <SidebarRoutes />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-x-4 items-center">
        <ToggleTheme />
        <UserButton />
      </div>
    </nav>
  );
}
