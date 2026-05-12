import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";

const createSchema = z.object({
  statusPageId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    // Verify status page belongs to user
    const page = await db.statusPage.findUnique({
      where: { id: parsed.data.statusPageId, userId },
    });
    if (!page) return new NextResponse("Not found", { status: 404 });

    const { startsAt, endsAt, ...rest } = parsed.data;

    const maintenance = await db.scheduledMaintenance.create({
      data: {
        ...rest,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    return handleApiError(error, "MAINTENANCE POST");
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { id, ...rest } = body;
    if (!id) return new NextResponse("Missing id", { status: 400 });

    const parsed = updateSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    // Verify ownership via status page
    const existing = await db.scheduledMaintenance.findUnique({
      where: { id },
      include: { statusPage: { select: { userId: true } } },
    });
    if (!existing || existing.statusPage.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { startsAt, endsAt, ...updateData } = parsed.data;

    const maintenance = await db.scheduledMaintenance.update({
      where: { id },
      data: {
        ...updateData,
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
      },
    });

    return NextResponse.json(maintenance);
  } catch (error) {
    return handleApiError(error, "MAINTENANCE PATCH");
  }
}
