# Business Management Dashboard

## Description

A comprehensive business management platform to manage companies, customers, events, and analytics in one place.

**Features:**

- **Company Management:** Track associated companies with contact details and corporate data.
- **Customer Management:** Store customer information and history.
- **Event Calendar:** Create and manage events and meetings linked to companies.
- **Analytics:** Visualize key business metrics through charts and statistics.
- **Tasks:** Manage pending tasks and activities.

## Tech Stack

### Frontend

- **Next.js 15** — React framework with App Router and server components.
- **React 18** — UI library.
- **TypeScript 5** — Type-safe development.
- **Tailwind CSS 3** — Utility-first CSS framework.
- **shadcn/ui** — Accessible, reusable component library.
- **React Hook Form + Zod** — Form handling and schema validation.
- **Recharts** — Data visualization and charts.
- **FullCalendar** — Calendar component for event management.
- **Clerk 6** — Authentication and user management.

### Backend

- **Prisma 6** — ORM for database interaction.
- **PostgreSQL** — Relational database.
- **Next.js API Routes** — Serverless API endpoints.
- **Uploadthing** — File upload service.

### Development Tools

- **ESLint** — Static code analysis.
- **Prettier** — Code formatter.
- **PostCSS** — CSS processing.
- **next-themes** — Light/dark theme support.

## Requirements

- Node.js >= 22
- PostgreSQL database

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JUANJSC630/dashboard-companies.git
cd dashboard-companies
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start development server         |
| `npm run build`        | Build for production             |
| `npm run start`        | Start production server          |
| `npm run lint`         | Run ESLint                       |
| `npm run format`       | Format code with Prettier        |
| `npm run format:check` | Check formatting without writing |

## Project Structure

```
/app          → Application routes and pages (App Router)
/components   → Shared reusable components
/lib          → Utilities and helper functions
/prisma       → Database schema and migrations
/public       → Static assets
/utils        → General utility functions
```
