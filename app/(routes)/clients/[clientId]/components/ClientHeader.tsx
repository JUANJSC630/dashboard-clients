import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientHeader() {
  return (
    <Link href="/clients">
      <Button variant="outline" size="sm">
        <ArrowLeft className="mr-2 size-4" />
        Back to Clients
      </Button>
    </Link>
  );
}
