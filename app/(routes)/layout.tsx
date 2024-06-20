import Sidebar from "@/components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <div className="hidden xl:block w-80 h-full xl:fixed ">
        <Sidebar />
      </div>
      <div className="w-full xl:ml-80">
        <div className="bg-background shadow-md p-4">
          <Navbar />
        </div>
        <div className="p-6 bg-[#fafbfc] dark:bg-secondary">{children}</div>
      </div>
    </div>
  );
}
