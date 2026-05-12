import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

const PERSONAL_CLIENT_NAME = "My Sites";

/**
 * Returns the user's personal "My Sites" client, creating it if it doesn't exist.
 * Used so users can add their own sites without a real client.
 */
export async function getOrCreatePersonalClient(userId: string) {
  const existing = await db.client.findFirst({
    where: { userId, firstName: PERSONAL_CLIENT_NAME, lastName: "(Personal)" },
    select: { id: true, firstName: true, lastName: true, businessName: true },
  });

  if (existing) return existing;

  return db.client.create({
    data: {
      userId,
      firstName: PERSONAL_CLIENT_NAME,
      lastName: "(Personal)",
      email: "self@personal",
      phone: "",
      businessName: "My Sites",
    },
    select: { id: true, firstName: true, lastName: true, businessName: true },
  });
}
