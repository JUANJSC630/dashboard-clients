import Logo from "@/components/Logo/Logo";
import { SidebarRoutes } from "@/components/SidebarRoutes";

export default function Sidebar() {
  return (
    <div className="h-screen">
      <div className="h-full flex flex-col border-r">
        <Logo />
        <SidebarRoutes />
      </div>
    </div>
  );
}
