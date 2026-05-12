import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * Maps Prisma and general errors to proper HTTP responses.
 * Use in API route catch blocks instead of raw 500s.
 *
 * @example
 * ```ts
 * } catch (error) {
 *   return handleApiError(error, "BILLING POST");
 * }
 * ```
 */
export function handleApiError(error: unknown, label: string): NextResponse {
  // ─── Prisma-specific errors ─────────────────────────────────────────

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(`[${label}] Prisma ${error.code}:`, error.message);

    switch (error.code) {
      // Connection errors
      case "P1001":
        return NextResponse.json(
          { error: "Service temporarily unavailable. Please try again." },
          { status: 503 },
        );

      case "P1002":
        return NextResponse.json(
          { error: "Database connection timed out. Please try again." },
          { status: 503 },
        );

      case "P1008":
        return NextResponse.json(
          { error: "Request timed out. Please try again." },
          { status: 504 },
        );

      // Constraint violations
      case "P2002": {
        const target = (error.meta?.target as string[])?.join(", ") ?? "field";
        return NextResponse.json(
          { error: `A record with that ${target} already exists.` },
          { status: 409 },
        );
      }

      case "P2003":
        return NextResponse.json(
          { error: "Referenced record does not exist." },
          { status: 400 },
        );

      // Not found
      case "P2025":
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 },
        );

      default:
        return NextResponse.json(
          { error: "A database error occurred." },
          { status: 500 },
        );
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(`[${label}] Prisma init error:`, error.message);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    console.error(`[${label}] Prisma panic:`, error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }

  // ─── General errors ─────────────────────────────────────────────────

  console.error(`[${label}]`, error);
  return NextResponse.json(
    { error: "Internal server error." },
    { status: 500 },
  );
}
