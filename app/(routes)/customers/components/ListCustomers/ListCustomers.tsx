import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import Link from "next/link";

export async function ListCustomers() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const customer = await db.customer.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {customer.map((customer) => (
        <Card key={customer.id}>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <div className="text-lg font-semibold flex gap-2">
                <p>{customer.firstName}</p>
                <p>{customer.lastName}</p>
              </div>
              <p className="text-muted-foreground">{customer.email}</p>
              <p className="text-muted-foreground">{customer.phone}</p>
            </div>
            <Link href={`/customers/${customer.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
