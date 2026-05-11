import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HeaderStatusPages } from "./components/HeaderStatusPages";
import { StatusPageList } from "./components/StatusPageList";

export const metadata: Metadata = {
  title: "Status Pages — Hosting Dashboard",
  description: "Manage your public status pages",
};

export default async function StatusPagesPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const [statusPages, sites] = await Promise.all([
    db.statusPage.findMany({
      where: { userId },
      include: {
        components: true,
        scheduledMaintenances: {
          where: { status: { not: "COMPLETED" } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.site.findMany({
      where: { userId },
      select: { id: true, name: true, status: true, url: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <HeaderStatusPages sites={sites} />
      <StatusPageList statusPages={statusPages} sites={sites} />
    </div>
  );
}
