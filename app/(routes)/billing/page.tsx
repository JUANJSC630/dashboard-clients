import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { BillingStatus } from "@prisma/client";
import { DataFilters } from "@/components/DataFilters";
import { BillingExportButton } from "./components/BillingExportButton";

const statusVariant: Record<
  BillingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  PENDING: "outline",
  OVERDUE: "destructive",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
];

export const metadata = {
  title: "Billing — Hosting Dashboard",
  description: "All billing records across your sites",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const [{ userId }, { status }] = await Promise.all([auth(), searchParams]);
  if (!userId) return redirect("/");

  const allBillings = await db.billing.findMany({
    where: { userId },
    include: {
      site: { select: { id: true, name: true } },
      client: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          businessName: true,
        },
      },
    },
    orderBy: { nextDueDate: "asc" },
  });

  // Global stats (unfiltered)
  const overdue = allBillings.filter((b) => b.status === "OVERDUE");
  const pending = allBillings.filter((b) => b.status === "PENDING");
  const paid = allBillings.filter((b) => b.status === "PAID");

  // Filtered view for table
  const billings = status
    ? allBillings.filter((b) => b.status === (status as BillingStatus))
    : allBillings;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Billing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            All billing records across your sites
          </p>
        </div>
        <BillingExportButton
          rows={billings.map((b) => ({
            site: b.site.name,
            client:
              b.client.businessName ??
              `${b.client.firstName} ${b.client.lastName}`,
            amount: b.amount,
            currency: b.currency,
            cycle: b.cycle,
            // react-doctor-disable-next-line react-doctor/rendering-hydration-mismatch-time
            nextDueDate: new Date(b.nextDueDate).toLocaleDateString(),
            status: b.status,
          }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-destructive">
            {overdue.length}
          </p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-background rounded-lg p-4 border shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{paid.length}</p>
          <p className="text-sm text-muted-foreground">Paid</p>
        </div>
      </div>

      <Suspense
        fallback={<div className="h-10 bg-muted rounded animate-pulse" />}
      >
        <DataFilters
          showSearch={false}
          filters={[
            { key: "status", placeholder: "Status", options: STATUS_OPTIONS },
          ]}
        />
      </Suspense>

      <div className="bg-background rounded-lg border shadow-sm">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Site
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Client
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Cycle
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Due Date
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {billings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    {allBillings.length === 0
                      ? "No billing records yet. Add them from the site detail page."
                      : "No records match the current filter."}
                  </td>
                </tr>
              )}
              {billings.map((b) => {
                // react-doctor-disable-next-line react-doctor/rendering-hydration-mismatch-time
                const isOverdue =
                  b.status === "PENDING" &&
                  new Date(b.nextDueDate) < new Date();
                return (
                  <tr
                    key={b.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <Link
                        href={`/sites/${b.site.id}`}
                        className="font-medium hover:underline"
                      >
                        {b.site.name}
                      </Link>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {b.client.businessName ??
                        `${b.client.firstName} ${b.client.lastName}`}
                    </td>
                    <td className="p-4 font-medium">
                      {b.amount} {b.currency}
                    </td>
                    <td className="p-4 text-muted-foreground">{b.cycle}</td>
                    <td
                      className={`p-4 ${isOverdue ? "text-destructive font-medium" : ""}`}
                      suppressHydrationWarning
                    >
                      {new Date(b.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant[b.status]}>
                        {b.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y">
          {billings.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">
              {allBillings.length === 0
                ? "No billing records yet."
                : "No records match the current filter."}
            </p>
          )}
          {billings.map((b) => {
            // react-doctor-disable-next-line react-doctor/rendering-hydration-mismatch-time
            const isOverdue =
              b.status === "PENDING" && new Date(b.nextDueDate) < new Date();
            return (
              <div key={b.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/sites/${b.site.id}`}
                    className="font-medium hover:underline text-sm"
                  >
                    {b.site.name}
                  </Link>
                  <Badge variant={statusVariant[b.status]} className="text-xs">
                    {b.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {b.client.businessName ??
                    `${b.client.firstName} ${b.client.lastName}`}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {b.amount} {b.currency} / {b.cycle}
                  </span>
                  <span
                    suppressHydrationWarning
                    className={
                      isOverdue
                        ? "text-destructive font-medium text-xs"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    Due {new Date(b.nextDueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
