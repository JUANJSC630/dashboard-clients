import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const { userId } = auth();
    const { customerId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const customer = await db.customer.update({
      where: { id: customerId, userId },
      data: values,
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("[COMPANY PATCH ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const { userId } = auth();
    const { customerId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteCustomer = await db.customer.delete({
      where: { id: customerId },
    });

    return NextResponse.json(deleteCustomer, { status: 200 });
  } catch (error) {
    console.error("[COMPANY DELETE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
