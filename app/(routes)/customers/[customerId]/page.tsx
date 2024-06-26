import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { CustomerInformation } from "./components/CustomerInformation";
import { FooterCustomer } from "./components/FooterCustomer/";

export default async function CustomerIdPage({
  params,
}: {
  params: { customerId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const customer = await db.customer.findUnique({
    where: {
      id: params.customerId,
      userId,
    },
  });

  if (!customer) {
    return redirect("/");
  }

  console.log(customer);
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <CustomerInformation customer={customer} />
      <FooterCustomer customerId={params.customerId} />
    </div>
  );
}
