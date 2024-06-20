import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string } },
) {
  try {
    const { userId } = auth();
    const { companyId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await db.company.update({
      where: { id: companyId, userId },
      data: values,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("[COMPANY PATCH ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { companyId: string } },
) {
  try {
    const { userId } = auth();
    const { companyId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteCompany = await db.company.delete({ where: { id: companyId } });

    return NextResponse.json(deleteCompany, { status: 200 });
  } catch (error) {
    console.error("[COMPANY DELETE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
