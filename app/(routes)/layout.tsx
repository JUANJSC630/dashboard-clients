import { SidebarProvider } from "@/components/Sidebar/sidebar-context";
import { DashboardContent } from "@/components/Sidebar/DashboardContent";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
