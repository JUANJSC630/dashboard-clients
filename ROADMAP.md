# Roadmap — Hosting Dashboard

Herramienta personal para gestionar sitios web de clientes: plataformas de hosting, facturación, incidentes y contactos.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk 6 |
| ORM | Prisma 6 |
| DB (dev/Vercel) | PostgreSQL — Neon |
| DB (Railway) | MySQL (proyectos legacy) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Deploy | Vercel |

---

## ✅ Phase 1 — Core Refactor (completado)

### Esquema Prisma
- [x] Modelos: `Client`, `Site`, `Contact`, `Billing`, `Incident`
- [x] Enums: `Platform`, `SiteStatus`, `BillingCycle`, `BillingStatus`, `Currency`, `IncidentPriority`, `IncidentStatus`, `IncidentType`
- [x] DB sincronizada con `prisma db push`

### Rutas eliminadas
- [x] `/companies`, `/customers`, `/tasks`
- [x] `/api/company`, `/api/customer`, `/api/event`

### Rutas nuevas
- [x] `/` — Dashboard con métricas reales (sites, clientes, incidentes abiertos, billing)
- [x] `/clients` — Lista de clientes con estado de sus sitios
- [x] `/clients/[clientId]` — Detalle: editar datos, ver sitios vinculados, eliminar
- [x] `/sites` — Lista de sitios con plataforma, status, conteos
- [x] `/sites/[siteId]` — Detalle: editar, contactos, billing, incidentes, eliminar
- [x] `/billing` — Tabla global de registros de facturación
- [x] `/incidents` — Tabla global de incidentes
- [x] `/analytics` — Charts por status de sitio, plataforma, incidentes por tipo y mes

### API routes
- [x] `POST/GET /api/client`
- [x] `PATCH/DELETE /api/client/[clientId]`
- [x] `POST/GET /api/site`
- [x] `PATCH/DELETE /api/site/[siteId]`
- [x] `POST /api/site/[siteId]/contact`
- [x] `POST /api/site/[siteId]/billing`
- [x] `POST /api/site/[siteId]/incident`
- [x] `PATCH/DELETE /api/billing/[billingId]`
- [x] `PATCH/DELETE /api/incident/[incidentId]`

### Componentes UI
- [x] `Badge` component
- [x] Sidebar colapsable con persistencia en localStorage
- [x] NavbarToggle para desktop

---

## ✅ Phase 2 — UX & Safety (completado)

- [x] **AlertDialog de confirmación** antes de eliminar en todos los modelos
  - Clientes, sitios, contactos, billing records, incidentes
  - Componente reutilizable `ConfirmDialog` en `components/ConfirmDialog/`
- [x] **Edición inline de contactos** — editar nombre, rol, email, teléfono directamente en la card
- [x] **Edición inline de billing** — editar monto, fecha, ciclo y moneda sin recrear el registro
- [x] **API PATCH/DELETE para contactos** — `app/api/contact/[contactId]/route.ts`
- [x] Validación del campo `url` y `repositoryUrl` al crear sitio (mensaje de error visible)

---

## ✅ Phase 3 — Filtros & Búsqueda (completado)

- [x] Buscador en `/sites` por nombre, URL o plataforma
- [x] Filtro por `status` en `/sites` (ACTIVE / PAUSED / DOWN / MAINTENANCE)
- [x] Filtro por `platform` en `/sites`
- [x] Buscador en `/clients` por nombre o businessName
- [x] Filtro por `status` en `/incidents` (OPEN / IN_PROGRESS / RESOLVED)
- [x] Filtro por `priority` en `/incidents`
- [x] Filtro por `status` en `/billing` (PENDING / PAID / OVERDUE)
- [x] Componente reutilizable `DataFilters` en `components/DataFilters/`

---

## ✅ Phase 4 — Features Extra (completado)

- [x] **Ping manual de uptime** — botón en `/sites/[siteId]` que hace fetch al URL del sitio y actualiza el status
- [x] **Vista de billing por cliente** — en `/clients/[clientId]` muestra total facturado, pendiente y próximas fechas (`ClientBillingSummary`)
- [x] **Export CSV** de billing e incidentes (componente reutilizable `ExportCSV` con `papaparse`)
- [x] **Historial de cambios de status** — modelo `SiteStatusLog` en DB, log automático en PATCH y ping
- [x] **Agrupación de incidentes por sitio** — toggle List / By Site en `/incidents`
- [x] **Duplicar sitio** — botón en `/sites/[siteId]` crea una copia con status PAUSED

---

## ✅ Phase 5 — Polish & Performance (completado)

- [x] `loading.tsx` para `/billing` e `/incidents` (skeleton loaders)
- [x] `<Suspense>` granular por sección en el dashboard home
- [x] Error boundaries con página de error personalizada por sección (`error.tsx` en cada ruta)
- [x] Empty states con icono cuando no hay datos (`ServerOff`, `Users`)
- [x] Responsive mobile completo — tablas de billing e incidentes tienen layout de cards en móvil
- [x] Meta tags y `generateMetadata` por página (estático en listas, dinámico en detalles)

---

## Modelos de datos actuales

```
Client
  id, userId, firstName, lastName, businessName?, email?, phone?, address?
  → sites[], billings[]

Site
  id, userId, clientId, name, url, platform (enum), status (enum)
  techStack?, repositoryUrl?, platformProjectId?, description?
  → contacts[], billings[], incidents[], client

Contact
  id, userId, siteId, name, role?, email?, phone?

Billing
  id, userId, siteId, clientId, amount, currency (enum), cycle (enum)
  nextDueDate, status (enum), notes?

Incident
  id, userId, siteId, title, description?, priority (enum)
  status (enum), type (enum), resolvedAt?
```
