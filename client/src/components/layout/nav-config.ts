import {
  LayoutDashboard,
  Library,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const appNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Prompts",
    href: "/vault",
    icon: Library,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];