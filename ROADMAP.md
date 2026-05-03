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

## 🔲 Phase 2 — UX & Safety

- [ ] **AlertDialog de confirmación** antes de eliminar en todos los modelos
  - Clientes, sitios, contactos, billing records, incidentes
  - Usar `@/components/ui/alert-dialog` (instalar con shadcn: `npx shadcn@latest add alert-dialog`)
- [ ] **Edición inline de contactos** — editar nombre, rol, email, teléfono directamente en la card
- [ ] **Edición inline de billing** — editar monto y fecha sin tener que eliminar y recrear
- [ ] **Toast de éxito con undo** en operaciones destructivas (si es posible)
- [ ] Validación del campo `url` al crear sitio (feedback visual si no es URL válida)

---

## 🔲 Phase 3 — Filtros & Búsqueda

- [ ] Buscador en `/sites` por nombre, URL o plataforma
- [ ] Filtro por `status` en `/sites` (ACTIVE / PAUSED / DOWN / MAINTENANCE)
- [ ] Filtro por `platform` en `/sites`
- [ ] Buscador en `/clients` por nombre o businessName
- [ ] Filtro por `status` en `/incidents` (OPEN / IN_PROGRESS / RESOLVED)
- [ ] Filtro por `priority` en `/incidents`
- [ ] Filtro por `status` en `/billing` (PENDING / PAID / OVERDUE)

---

## 🔲 Phase 4 — Features Extra

- [ ] **Ping manual de uptime** — botón en `/sites/[siteId]` que hace fetch al URL del sitio y actualiza el status
- [ ] **Vista de billing por cliente** — en `/clients/[clientId]` mostrar total facturado y próximas fechas
- [ ] **Export CSV** de billing e incidentes (librería: `papaparse`)
- [ ] **Historial de cambios de status** de un sitio (log básico guardado en DB)
- [ ] **Agrupación de incidentes por sitio** en la página `/incidents`
- [ ] **Duplicar sitio** para crear uno nuevo basado en uno existente

---

## 🔲 Phase 5 — Polish & Performance

- [ ] `loading.tsx` para `/billing`, `/incidents`, `/clients` y `/sites` (skeleton loaders)
- [ ] Error boundaries con página de error personalizada por sección
- [ ] Empty states con ilustración/ícono cuando no hay datos
- [ ] Responsive mobile completo (especialmente tablas de billing e incidentes)
- [ ] `<Suspense>` granular por sección en el dashboard home
- [ ] Meta tags y `generateMetadata` por página

---

## 🔧 Configuración manual requerida

Estas cosas no se pueden hacer desde el código y las tienes que hacer tú:

### Vercel
- [ ] Agregar variable de entorno `DATABASE_URL` (Neon connection string)
- [ ] Agregar variables de entorno de Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- [ ] Agregar `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` y `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- [ ] Configurar Node.js 22 en Project Settings → General → Node.js Version
- [ ] Deshabilitar "Legacy Prerendering" si sigue apareciendo el warning

### Clerk Dashboard
- [ ] Configurar allowed redirect URLs para producción
- [ ] Activar los métodos de login que quieras (email, Google, etc.)

### Base de datos
- [ ] En cada deploy nuevo con cambios de schema: correr `npx prisma db push` o `npx prisma migrate deploy`
- [ ] Para Railway con MySQL: cambiar `provider = "mysql"` en `schema.prisma` y ajustar los campos `@db.Text`

### UploadThing (si se usa)
- [ ] Agregar `UPLOADTHING_SECRET` y `UPLOADTHING_APP_ID` en Vercel

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
