import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarRoutes } from "@/components/SidebarRoutes/SidebarRoutes";
import { ToggleTheme } from "@/components/ToggleTheme/ToggleTheme";
import { NavbarToggle } from "./NavbarToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center px-4 md:px-6 gap-x-4 justify-between w-full bg-background border-b h-16 sticky top-0 z-30">
      <div className="flex items-center gap-x-2">
        <div className="block xl:hidden">
          <Sheet>
            <SheetTrigger className="flex items-center p-1.5 rounded-md hover:bg-foreground/[0.05] transition-colors">
              <Menu className="size-5" strokeWidth={1.75} />
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SidebarRoutes />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden xl:block">
          <NavbarToggle />
        </div>
      </div>
      <div className="flex gap-x-3 items-center">
        <ToggleTheme />
        <UserButton />
      </div>
    </nav>
  );
}
