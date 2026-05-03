"use client";

import dynamic from "next/dynamic";
import { CalendarSkeleton } from "./CalendarSkeleton";
import { CalendarProps } from "./Calendar.types";

const Calendar = dynamic(
  () => import("./Calendar").then((m) => ({ default: m.Calendar })),
  { ssr: false, loading: () => <CalendarSkeleton /> },
);

export function CalendarWrapper(props: CalendarProps) {
  return <Calendar {...props} />;
}
