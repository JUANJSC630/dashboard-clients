import {
  BarChart4,
  Globe,
  LayoutDashboard,
  Users,
  CreditCard,
  AlertTriangle,
  CircleHelpIcon,
} from "lucide-react";

export const dataGeneralSidebar = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Clients",
    href: "/clients",
  },
  {
    icon: Globe,
    label: "Sites",
    href: "/sites",
  },
];

export const dataToolsSidebar = [
  {
    icon: CreditCard,
    label: "Billing",
    href: "/billing",
  },
  {
    icon: AlertTriangle,
    label: "Incidents",
    href: "/incidents",
  },
  {
    icon: BarChart4,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: CircleHelpIcon,
    label: "FAQs",
    href: "/faqs",
  },
];
