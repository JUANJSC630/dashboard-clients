# Roadmap — Hosting Dashboard · Site Health Automation

Herramienta personal para gestionar sitios web de clientes con **monitoreo automático y en tiempo real** del estado de cada sitio.

---

## Stack actual

| Capa            | Tecnología                       |
| --------------- | -------------------------------- |
| Framework       | Next.js 15 (App Router)          |
| Auth            | Clerk 6                          |
| ORM             | Prisma 6                         |
| DB              | PostgreSQL — Neon                |
| UI              | Tailwind CSS + shadcn/ui         |
| Charts          | Recharts                         |
| Deploy          | Vercel                           |
| File upload     | UploadThing                      |

## Stack a agregar (monitoreo)

| Necesidad             | Herramienta                            | Por qué                                                           |
| --------------------- | -------------------------------------- | ----------------------------------------------------------------- |
| Cron jobs             | **Vercel Cron Jobs** (`vercel.json`)   | Built-in, sin costo extra, hasta 1/min en Pro                     |
| Queue individual      | **Upstash QStash**                     | Checks por sitio, reintentos automáticos, free 500/día            |
| Email alerts          | **Resend** (`resend` npm)              | API simple, 3 000 emails/mes gratis, React Email templates        |
| Real-time UI          | **SSE nativo** (Next.js Route Handler) | `ReadableStream`, sin WebSocket server, funciona en Vercel Edge   |
| SSL check             | **`node:tls`** (built-in)              | Sin dependencias extra, lee el certificado TLS del sitio          |
| Cache de estado       | **Upstash Redis** (opcional)           | Lectura O(1) del último status, evita queries a Neon en tiempo real |

---

## ✅ Fases completadas (1–5)

- Modelos Prisma, APIs REST completas, rutas de detalle
- UX & Safety: ConfirmDialog, edición inline, validaciones
- Filters & Search: DataFilters, URL-based state, skeletons
- Features extra: ping manual, export CSV, duplicar sitio, historial de status, billing por cliente
- Polish: Suspense granular, error boundaries, empty states, responsive mobile, generateMetadata

---

## 🔲 Phase 6 — Automated Health Checks (Core)

> **Objetivo:** Cada sitio se verifica automáticamente cada N minutos sin intervención manual.

### 6.1 — Nuevo modelo `SitePingLog`

```prisma
model SitePingLog {
  id           String   @id @default(uuid())
  siteId       String
  isUp         Boolean
  statusCode   Int?
  latencyMs    Int?
  errorMessage String?
  checkedAt    DateTime @default(now())

  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)

  @@index([siteId])
  @@index([checkedAt])
}
```

- Agregar `pingLogs SitePingLog[]` al modelo `Site`
- Agregar `checkIntervalMin Int @default(5)` al modelo `Site` (configurable: 1, 5, 15, 30, 60)
- Agregar `sslExpiresAt DateTime?` y `sslDaysLeft Int?` al modelo `Site`
- Correr `prisma db push`

### 6.2 — Endpoint `/api/cron/health-check/route.ts`

- Método: `GET` (Vercel llama GET a los cron endpoints)
- Auth: verificar header `Authorization: Bearer $CRON_SECRET`
- Lógica:
  1. Traer todos los `Site` activos (status `ACTIVE` | `DOWN` | `MAINTENANCE`)
  2. Para cada sitio: `fetch(site.url, { signal: AbortSignal.timeout(8000) })`
  3. Medir `latencyMs`, capturar `statusCode`
  4. Crear `SitePingLog` con el resultado
  5. Si status cambió → actualizar `Site.status`, crear `SiteStatusLog`
  6. Actualizar `Site.lastCheckedAt` y `Site.uptimePercent` (últimas 24h)
- Usar `Promise.allSettled()` para checks en paralelo (no bloquear por un sitio lento)

### 6.3 — `vercel.json` con cron schedule

```json
{
  "crons": [
    {
      "path": "/api/cron/health-check",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

- Variable de entorno: `CRON_SECRET` (string random, min 32 chars)
- Hobby plan: máx 1 cron/día → usar QStash para intervals cortos en dev/staging
- Pro plan: hasta 1 ejecución por minuto

### 6.4 — Cálculo de `uptimePercent`

- Función `calculateUptime(siteId, hours = 24)` en `lib/uptime.ts`
- Query: `SitePingLog` de las últimas N horas agrupado por `isUp`
- Fórmula: `(countUp / total) * 100`
- Se recalcula en cada cron y se persiste en `Site.uptimePercent`

---

## ✅ Phase 7 — Alertas & Notificaciones (completado)

> **Objetivo:** Recibir email inmediatamente cuando un sitio cae o se recupera.

### 7.1 — Modelo `SiteAlertConfig`

```prisma
model SiteAlertConfig {
  id               String    @id @default(uuid())
  siteId           String    @unique
  alertEmail       String
  onDown           Boolean   @default(true)
  onRecover        Boolean   @default(true)
  onSslExpiry      Boolean   @default(true)
  sslDaysThreshold Int       @default(14)
  cooldownMinutes  Int       @default(60)
  lastAlertSentAt  DateTime?
  webhookUrl       String?

  site Site @relation(fields: [siteId], references: [id], onDelete: Cascade)
}
```

### 7.2 — Integración con Resend

- Instalar: `npm install resend`
- `lib/email.ts` — cliente Resend + funciones `sendDownAlert(site)`, `sendRecoverAlert(site)`, `sendSslAlert(site, daysLeft)`
- Templates en `emails/` con React Email (HTML responsive)
- El cron llama a estas funciones cuando detecta cambio de estado
- **Cooldown:** no enviar más de 1 alerta por sitio por `cooldownMinutes`

### 7.3 — UI de configuración de alertas en `/sites/[siteId]`

- Nueva sección "Alert Settings" en la página de detalle
- Form: email, toggles `onDown` / `onRecover` / `onSslExpiry`, `cooldownMinutes`
- API: `POST/PATCH /api/site/[siteId]/alert-config`
- Componente: `SiteAlertConfig/SiteAlertConfig.tsx`

### 7.4 — Webhook support

- Campo `webhookUrl String?` en `SiteAlertConfig`
- Cuando se activa una alerta: `POST webhookUrl` con payload JSON `{ site, event, status, timestamp }`
- Compatible con Slack Incoming Webhooks, Discord, o cualquier receptor HTTP

---

## 🔲 Phase 8 — Real-time Dashboard

> **Objetivo:** Los status se actualizan en la UI sin recargar la página.

### 8.1 — SSE endpoint `/api/events/sites/route.ts`

- `GET` handler que devuelve `text/event-stream`
- Hace poll a DB cada 10s y emite JSON con `{ id, status, lastCheckedAt, uptimePercent }[]`
- Cleanup automático cuando el cliente desconecta (abort signal)

### 8.2 — Hook `useLiveSiteStatus`

- `hooks/useLiveSiteStatus.ts` — `useEffect` con `new EventSource("/api/events/sites")`
- Devuelve `Map<siteId, { status, lastCheckedAt, uptimePercent }>`
- Cleanup: `source.close()` en el return del `useEffect`

### 8.3 — Componentes live

- `LiveStatusBadge` — Badge que se actualiza sin reload, con dot animado (pulso) cuando está verificando
- `LiveUptimeBadge` — Muestra el `%` de uptime con color semáforo (verde >99%, amarillo >95%, rojo <95%)
- Integrar en `ListSites`, `SiteHeader`, y tarjetas del dashboard

---

## 🔲 Phase 9 — Métricas & Charts de Salud

> **Objetivo:** Visualizar historial de latencia y uptime de cada sitio.

### 9.1 — Response Time Chart

- En `/sites/[siteId]` — nueva sección "Performance"
- Query: últimos 100 `SitePingLog` del sitio ordenados por `checkedAt`
- `Recharts LineChart`: `latencyMs` en Y, tiempo en X
- Línea de referencia en 1 000ms (alerta visual si supera)

### 9.2 — Uptime Timeline (30 días)

- Barra visual día a día (estilo Statuspage / GitHub contributions)
- Cada celda = 1 día, color según uptime %: verde >99% · amarillo 95-99% · rojo <95% · gris sin datos
- Componente: `UptimeTimeline.tsx`
- Query: `SitePingLog` agrupado por día con `checkedAt >= 30 días atrás`

### 9.3 — Stats en el Dashboard home

- Ampliar `DashboardStats` con:
  - Total sitios `DOWN` en este momento
  - Promedio de uptime global de todos los sitios
  - Sitios con SSL a punto de vencer (< 14 días)
- Cards con color de alerta si hay problemas

### 9.4 — Analytics page — nueva sección "Uptime & Latency"

- Top 5 sitios más lentos (promedio latencia última semana)
- Top 5 sitios con más downtime
- Gráfico de incidentes manuales vs pings fallidos (correlación)

---

## 🔲 Phase 10 — SSL & DNS Monitoring

> **Objetivo:** Detectar proactivamente problemas de certificados antes de que afecten a los usuarios.

### 10.1 — SSL Check en el cron

```ts
import tls from "node:tls";

function checkSsl(hostname: string): Promise<{ expiresAt: Date; daysLeft: number }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, { servername: hostname }, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();
      const expiresAt = new Date(cert.valid_to);
      const daysLeft = Math.floor((expiresAt.getTime() - Date.now()) / 86_400_000);
      resolve({ expiresAt, daysLeft });
    });
    socket.on("error", reject);
  });
}
```

- Correr el check SSL una vez al día por sitio (no en cada ping de 5 min)
- Actualizar `Site.sslExpiresAt` y `Site.sslDaysLeft`
- Si `daysLeft <= 14` y `onSslExpiry: true` → enviar alerta Resend

### 10.2 — Indicador SSL en UI

- En `SiteHeader`: badge dinámico "SSL OK" / "Vence en X días" / "EXPIRADO"
- Verde / amarillo / rojo según `sslDaysLeft`

### 10.3 — DNS check

- `dns.resolve(hostname, 'A')` desde `node:dns/promises`
- Si falla → `SitePingLog` con `isUp: false, errorMessage: "DNS resolution failed"`
- No requiere modelo extra

---

## 🔲 Phase 11 — Página de Status Pública

> **Objetivo:** URL pública por usuario que muestra el estado de sus sitios sin login.

### 11.1 — Ruta `/status/[userId]`

- Página pública (sin middleware de auth)
- Muestra todos los sitios marcados como públicos con:
  - Status actual + badge de color
  - Uptime % últimas 24h / 7 días / 30 días
  - Uptime timeline de 30 días
  - Incidentes activos con banner de alerta

### 11.2 — Toggle `isPublic` en `Site`

- Agregar `isPublic Boolean @default(false)` al modelo `Site`
- Toggle en `/sites/[siteId]` con tooltip explicativo
- La página pública solo lista sitios donde `isPublic: true`

### 11.3 — Auto-resolve de incidentes

- Cuando el cron detecta que un sitio vuelve a `ACTIVE` tras estar `DOWN`
- Si hay incidentes `OPEN` o `IN_PROGRESS` para ese sitio → marcarlos como `RESOLVED` automáticamente con `resolvedAt: new Date()`

---

## Arquitectura del flujo completo

```
Vercel Cron (*/5 * * * *)
  └─► GET /api/cron/health-check   ← CRON_SECRET header auth
        ├─► Promise.allSettled( fetch(site.url) × todos los sitios )
        │     ├─► Crear SitePingLog (isUp, latencyMs, statusCode, error?)
        │     ├─► Actualizar Site.status + lastCheckedAt + uptimePercent
        │     ├─► Si status cambió → SiteStatusLog + auto-resolve incidents
        │     ├─► Si SSL check day → node:tls → Site.sslExpiresAt + sslDaysLeft
        │     └─► Si DOWN/RECOVER/SSL → Resend email + webhook (con cooldown)
        └─► Response 200 OK

Cliente (browser)
  └─► EventSource("/api/events/sites")
        └─► Recibe updates cada 10s
              └─► LiveStatusBadge / LiveUptimeBadge re-renderizan sin reload
```

---

## Variables de entorno necesarias

```env
# Ya existentes
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Nuevas (monitoreo)
CRON_SECRET=              # Random secret ≥32 chars para auth del cron
RESEND_API_KEY=           # Para emails de alerta  (resend.com)
UPSTASH_REDIS_REST_URL=   # Opcional: cache de status en tiempo real
UPSTASH_REDIS_REST_TOKEN= # Opcional
QSTASH_TOKEN=             # Opcional: scheduling granular por sitio
```

---

## Orden de implementación recomendado

| Prioridad | Phase    | Impacto                                         |
| --------- | -------- | ----------------------------------------------- |
| 1 ⚡      | Phase 6  | Base de todo — cron automático + SitePingLog    |
| 2 🔔      | Phase 7  | Valor inmediato — alerta al caer un sitio       |
| 3 🟢      | Phase 8  | UX — ver cambios en vivo sin recargar           |
| 4 📊      | Phase 9  | Visibilidad — charts de latencia y uptime       |
| 5 🔐      | Phase 10 | Prevención — SSL antes de que expire            |
| 6 🌐      | Phase 11 | Diferenciador — status page pública por cliente |
