# Dashboard Companies — Agent Instructions

## Project Overview

SaaS dashboard for managing hosting clients, sites, billing, and uptime monitoring. Built with Next.js 15 App Router, Clerk auth, Prisma/PostgreSQL, Tailwind + shadcn/ui.

See [README.md](README.md) for full feature list and setup guide.

## Dev Commands

```bash
npm run dev       # Start dev server (requires Node >= 22)
npm run build     # Production build
npm run lint      # ESLint check
npx prisma studio # Open DB GUI
npx prisma migrate dev --name <name>  # Create + apply migration
npx prisma generate   # Regenerate Prisma client after schema changes
```

## Architecture

### Route Groups

- `app/(auth)/(routes)/` — Public sign-in / sign-up pages (Clerk UI)
- `app/(routes)/` — Authenticated dashboard; all pages live here
- `app/api/` — Route handlers (serverless, Next.js App Router style)

### Auth & Tenancy

- Clerk via `clerkMiddleware` in [middleware.ts](middleware.ts)
- Public routes: `/sign-in(.*)`, `/sign-up(.*)`, `/api/uploadthing`, `/api/cron/(.*)`
- Every page/route handler calls `auth()` from `@clerk/nextjs/server` and scopes Prisma queries with `where: { userId }`
- **No separate service/repository layer** — pages and route handlers query Prisma directly via [`lib/db.ts`](lib/db.ts)

### Page Pattern

```ts
const { userId } = await auth();
if (!userId) return redirect("/");

const data = await db.model.findMany({
  where: { userId },
  include: { relations: true },
});
return <PageComponent data={data} />;
```

Pages are async server components. Client components handle forms, filters, dialogs, and toasts.

### API Route Pattern

```ts
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  // parse body, query Prisma, return NextResponse.json(...)
  // on error: return new NextResponse("Internal Server Error", { status: 500 })
}
```

### Component Organization

- Shared components → [`components/`](components/) with barrel `index.ts` exports
- Page-specific components → colocated in each route's `components/` folder (e.g., `app/(routes)/clients/components/`)
- UI primitives → [`components/ui/`](components/ui/) (shadcn/ui, do not edit directly)

## Database

Schema: [`prisma/schema.prisma`](prisma/schema.prisma)

Key models: `Client → Site → Incident | Billing | SitePingLog | SiteStatusLog | SiteAlertConfig | Contact`

- All PKs are `String @id @default(uuid())`
- Multi-tenancy via `userId` field on root entities (`Client`, `Site`, `Billing`)
- `relationMode = "prisma"` — no native FK constraints; index relations manually
- After schema changes always run `npx prisma generate` then `npx prisma migrate dev`

## Conventions

- **Forms**: React Hook Form + Zod schemas; see `FormCreateClient.tsx` as reference
- **Validation**: Zod at form and API boundary level
- **Styling**: Tailwind utility classes; theme tokens via `next-themes`; `cn()` from [`lib/utils.ts`](lib/utils.ts) for conditional classes
- **Icons**: `lucide-react`
- **Date formatting**: [`lib/formatDate.ts`](lib/formatDate.ts)
- **Price formatting**: [`lib/formatPrice.ts`](lib/formatPrice.ts)
- **File uploads**: Uploadthing via [`utils/uploadthing.ts`](utils/uploadthing.ts)
- **Email**: Resend via [`lib/email.ts`](lib/email.ts)
- **Uptime/health checks**: Cron via `.github/workflows/health-check.yml` → `app/api/cron/health-check/route.ts`; protected by `CRON_SECRET` header

## Required Environment Variables

```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
RESEND_API_KEY
NEXT_PUBLIC_APP_URL          # defaults to http://localhost:3000
CRON_SECRET                  # used in health-check cron route + GitHub Actions
```

No `.env.example` exists — use this list as reference.
