import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const data = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const company = await db.company.create({
      data: {
        ...data,
        userId,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
