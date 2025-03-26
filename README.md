# Business Management Dashboard

## Business Description

Dashboard is a comprehensive business management platform designed to help companies manage their relationships with customers, associated companies, projects, and billing. The platform allows:

- **Company Management:** Administration of associated companies with detailed contact information and corporate data.
- **Customer Management:** Tracking of customers, their contact information, and history.
- **Project Management:** Creation and tracking of projects with start/end dates, status, and description.
- **Invoicing:** Generation and tracking of invoices linked to customers and projects.
- **Event Calendar:** Organization of events and meetings associated with companies.
- **Analytics:** Visualization of key business data through graphs and statistics.
- **Tasks:** Management of pending tasks and activities.

## Technologies Used

### Frontend
- **Next.js 14:** High-performance React framework with file-based routing.
- **TypeScript:** Typed language for robust and maintainable development.
- **Tailwind CSS:** CSS utility framework for responsive and modern design.
- **shadcn/ui:** Reusable and accessible interface components.
- **React Hook Form:** Efficient form handling with validation.
- **Zod:** Schema validation for TypeScript.
- **Recharts:** Library for data visualization and graphs.
- **FullCalendar:** Advanced component for calendar management.
- **Clerk:** Authentication and user management service.

### Backend
- **Prisma ORM:** Object-relational mapping for database interaction.
- **PostgreSQL:** Relational database for persistent storage.
- **Next.js API Routes:** Serverless API endpoints for backend operations.
- **Uploadthing:** Service for file upload and management.

### Development Tools
- **ESLint:** Static code analysis to identify problems.
- **PostCSS:** Tool for transforming CSS with JavaScript plugins.
- **next-themes:** Support for light/dark themes.

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/JUANJSC630/dashboard-clients.git
cd dashboard-clients
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by creating a `.env` file with the following values:
```
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

## Project Structure

- `/app`: Contains application routes and pages
- `/components`: Reusable components
- `/lib`: Utilities and helper functions
- `/prisma`: Database schema and migrations
- `/public`: Static files
- `/utils`: General utility functions
