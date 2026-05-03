import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { userId } = await auth();
    const { companyId } = await params;
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
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const { userId } = await auth();
    const { companyId } = await params;

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
