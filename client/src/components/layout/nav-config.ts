import {
  LayoutDashboard,
  Library,
  FilePlus2,
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
    label: "Create Prompt",
    href: "/vault/new",
    icon: FilePlus2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function isNavItemActive(pathname: string, item: NavItem) {
  if (pathname === item.href) {
    return true;
  }

  // Prompt detail pages belong to My Prompts,
  // but the create page has its own navigation item.
  if (item.href === "/vault") {
    return (
      pathname.startsWith("/vault/") &&
      pathname !== "/vault/new"
    );
  }

  return false;
}