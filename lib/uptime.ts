import { db } from "@/lib/db";

/**
 * Calcula el porcentaje de uptime de un sitio en las últimas N horas.
 * Devuelve null si no hay pings registrados en ese período.
 */
export async function calculateUptime(
  siteId: string,
  hours = 24,
): Promise<number | null> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const [total, up] = await Promise.all([
    db.sitePingLog.count({
      where: { siteId, checkedAt: { gte: since } },
    }),
    db.sitePingLog.count({
      where: { siteId, isUp: true, checkedAt: { gte: since } },
    }),
  ]);

  if (total === 0) return null;

  return Math.round((up / total) * 10000) / 100; // 2 decimales
}
