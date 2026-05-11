import { CheckCircle2, AlertTriangle, XCircle, Wrench } from "lucide-react";

const config = {
  operational: {
    icon: CheckCircle2,
    label: "All Systems Operational",
    bg: "bg-[#ecfdf5] dark:bg-[#052e16]",
    border: "border-[#a7f3d0] dark:border-[#065f46]",
    text: "text-[#065f46] dark:text-[#6ee7b7]",
    iconColor: "text-[#10b981]",
  },
  degraded: {
    icon: AlertTriangle,
    label: "Degraded Performance",
    bg: "bg-[#fffbeb] dark:bg-[#451a03]",
    border: "border-[#fde68a] dark:border-[#92400e]",
    text: "text-[#92400e] dark:text-[#fcd34d]",
    iconColor: "text-[#f59e0b]",
  },
  major_outage: {
    icon: XCircle,
    label: "Major Outage",
    bg: "bg-[#fef2f2] dark:bg-[#450a0a]",
    border: "border-[#fecaca] dark:border-[#991b1b]",
    text: "text-[#991b1b] dark:text-[#fca5a5]",
    iconColor: "text-[#ef4444]",
  },
  maintenance: {
    icon: Wrench,
    label: "Under Maintenance",
    bg: "bg-[#eff6ff] dark:bg-[#172554]",
    border: "border-[#bfdbfe] dark:border-[#1e40af]",
    text: "text-[#1e40af] dark:text-[#93c5fd]",
    iconColor: "text-[#3b82f6]",
  },
} as const;

export function OverallStatus({
  status,
}: {
  status: "operational" | "degraded" | "major_outage" | "maintenance";
}) {
  const c = config[status];
  const Icon = c.icon;

  return (
    <div
      className={`rounded-xl border ${c.bg} ${c.border} px-6 py-5 flex items-center gap-4`}
    >
      <Icon className={`size-8 ${c.iconColor}`} strokeWidth={2} />
      <span className={`text-xl font-semibold ${c.text}`}>{c.label}</span>
    </div>
  );
}
