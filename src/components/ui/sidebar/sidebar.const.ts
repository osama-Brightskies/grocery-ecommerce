import { Gauge, Package, Layers, Tags, ReceiptText, Users } from "lucide-react";

export const navItems = [
  { title: "Dashboard", navLink: "/dashboard", icon: Gauge },
  { title: "Products", navLink: "/products", icon: Package },
  { title: "Categories", navLink: "/categories", icon: Layers },
  { title: "Tags", navLink: "/tags", icon: Tags },
  { title: "Orders", navLink: "/orders", icon: ReceiptText },
  { title: "Users", navLink: "/users", icon: Users },
];
