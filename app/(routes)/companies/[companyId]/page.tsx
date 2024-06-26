import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Header } from "./components/Header";
import { CompanyInformation } from "./components/CompanyInformation";
import { FooterCompany } from "./components/FooterCompany";

export default async function CompanyIdPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
      userId,
    },
  });

  if (!company) {
    return redirect("/");
  }

  console.log(company);
  return (
    <div className="flex flex-col gap-4">
      <Header />
      <CompanyInformation company={company} />
      <FooterCompany companyId={params.companyId} />
    </div>
  );
}
