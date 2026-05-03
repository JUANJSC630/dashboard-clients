import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { userId } = await auth();
    const { customerId } = await params;
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
    console.error("[CUSTOMER PATCH ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { userId } = await auth();
    const { customerId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deleteCustomer = await db.customer.delete({
      where: { id: customerId },
    });

    return NextResponse.json(deleteCustomer, { status: 200 });
  } catch (error) {
    console.error("[CUSTOMER DELETE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
