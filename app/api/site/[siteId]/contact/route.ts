import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { createContactSchema } from "@/lib/schemas";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  try {
    const [{ userId }, { siteId }, body] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const site = await db.site.findUnique({ where: { id: siteId } });
    if (!site) return new NextResponse("Site not found", { status: 404 });

    const contact = await db.contact.create({
      data: { siteId, ...parsed.data },
    });

    return NextResponse.json(contact);
  } catch (error) {
    return handleApiError(error, "CONTACT POST");
  }
}
