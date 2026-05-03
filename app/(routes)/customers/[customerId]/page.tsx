import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { CustomerInformation } from "./components/CustomerInformation";
import { FooterCustomer } from "./components/FooterCustomer/";

export default async function CustomerIdPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { userId } = await auth();
  const { customerId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const customer = await db.customer.findUnique({
    where: {
      id: customerId,
      userId,
    },
  });

  if (!customer) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <CustomerInformation customer={customer} />
      <FooterCustomer customerId={customerId} />
    </div>
  );
}
