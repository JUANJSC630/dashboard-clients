import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { z } from "zod";

const createUpdateSchema = z.object({
  status: z.enum(["INVESTIGATING", "IDENTIFIED", "MONITORING", "RESOLVED"]),
  message: z.string().min(1),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  try {
    const [{ userId }, { incidentId }, body] = await Promise.all([
      auth(),
      params,
      req.json(),
    ]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = createUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    // Verify incident belongs to user
    const incident = await db.incident.findUnique({
      where: { id: incidentId, userId },
    });
    if (!incident) return new NextResponse("Not found", { status: 404 });

    const update = await db.incidentUpdate.create({
      data: {
        incidentId,
        status: parsed.data.status,
        message: parsed.data.message,
      },
    });

    // Auto-resolve incident if update status is RESOLVED
    if (parsed.data.status === "RESOLVED") {
      await db.incident.update({
        where: { id: incidentId },
        data: { status: "RESOLVED", resolvedAt: new Date() },
      });
    } else if (parsed.data.status === "IDENTIFIED" || parsed.data.status === "MONITORING") {
      await db.incident.update({
        where: { id: incidentId },
        data: { status: "IN_PROGRESS" },
      });
    }

    return NextResponse.json(update);
  } catch (error) {
    return handleApiError(error, "INCIDENT_UPDATE POST");
  }
}
