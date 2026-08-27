import {
  LayoutDashboard, //changed here the logo of overview
  Package,
  FolderClosed,
  Clock,
  Settings,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", navLink: "/dashboard", icon: LayoutDashboard }, //changed here the overview to dashboard
  { title: "Products", navLink: "/products", icon: Package },
  { title: "Categories", navLink: "/categories", icon: FolderClosed },
  { title: "Orders", navLink: "/orders", icon: Clock },
  { title: "Settings", navLink: "/settings", icon: Settings },
];
