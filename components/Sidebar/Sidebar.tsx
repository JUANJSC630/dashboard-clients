import Logo from "@/components/Logo/Logo";
import { SidebarRoutes } from "@/components/SidebarRoutes/SidebarRoutes";

export default function Sidebar() {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col border-r bg-background">
        <Logo />
        <SidebarRoutes />
      </div>
    </div>
  );
}
