import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CalendarWrapper } from "./components/Calendar/CalendarWrapper";

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const companies = await db.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const events = await db.event.findMany({
    where: {
      companyId: { in: companies.map((company) => company.id) },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <CalendarWrapper companies={companies} events={events} />
    </div>
  );
}
