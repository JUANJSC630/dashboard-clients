import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { HeaderClients } from "./components/HeaderClients/HeaderClients";
import { ListClients } from "./components/ListClients/ListClients";

export default async function ClientsPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const clients = await db.client.findMany({
    where: { userId },
    include: { sites: { select: { id: true, status: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <HeaderClients clients={clients} />
      <ListClients clients={clients} />
    </div>
  );
}
