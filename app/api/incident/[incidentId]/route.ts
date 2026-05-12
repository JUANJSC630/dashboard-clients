import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { updateIncidentSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  try {
    const [{ userId }, { incidentId }, body] = await Promise.all([auth(), params, req.json()]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const parsed = updateIncidentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(parsed.error.flatten(), { status: 400 });
    }

    const incident = await db.incident.update({
      where: { id: incidentId, userId },
      data: parsed.data,
    });

    return NextResponse.json(incident);
  } catch (error) {
    return handleApiError(error, "INCIDENT PATCH");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ incidentId: string }> },
) {
  try {
    const [{ userId }, { incidentId }] = await Promise.all([auth(), params]);

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const deleted = await db.incident.delete({
      where: { id: incidentId, userId },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    return handleApiError(error, "INCIDENT DELETE");
  }
}
