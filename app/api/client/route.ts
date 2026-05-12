import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { createClientSchema } from "@/lib/schemas";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const client = await db.client.create({
      data: { ...parsed.data, userId },
    });

    return NextResponse.json(client);
  } catch (error) {
    return handleApiError(error, "CLIENT POST");
  }
}
