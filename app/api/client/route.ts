import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const data = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const client = await db.client.create({
      data: { ...data, userId },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("[CLIENT POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
