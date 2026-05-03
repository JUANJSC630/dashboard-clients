import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { CompanyInformation } from "./components/CompanyInformation";
import { FooterCompany } from "./components/FooterCompany";

export default async function CompanyIdPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { userId } = await auth();
  const { companyId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <CompanyInformation company={company} />
      <FooterCompany companyId={companyId} />
    </div>
  );
}
