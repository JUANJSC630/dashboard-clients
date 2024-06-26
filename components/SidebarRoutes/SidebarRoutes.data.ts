import { Exo_2 } from "next/font/google";
import {
  BarChart4,
  Building2,
  PanelsTopLeft,
  Settings,
  ShieldCheck,
  CircleHelpIcon,
  Calendar,
  Users
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: PanelsTopLeft,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Customers",
    href: "/customers",
  },
  {
    icon: Building2,
    label: "Companies",
    href: "/companies",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "/tasks",
  },
];

export const dataToolsSidebar = [
  {
    icon: CircleHelpIcon,
    label: "Faqs",
    href: "/faqs",
  },
  {
    icon: BarChart4,
    label: "Analytics",
    href: "/analytics",
  },
];

// export const dataSupportSidebar = [
//   {
//     icon: Settings,
//     label: "Setting",
//     href: "/setting",
//   },
//   {
//     icon: ShieldCheck,
//     label: "Security",
//     href: "/security",
//   },
// ];
