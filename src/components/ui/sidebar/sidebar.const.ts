import {
  LayoutGrid,
  Package,
  FolderTree,
  Tags,
  ShoppingBag,
  Settings,
} from "lucide-react";

export const navItems = [
  { title: "Overview", navLink: "/overview", icon: LayoutGrid },
  { title: "Products", navLink: "/products", icon: Package },
  { title: "Categories", navLink: "/categories", icon: FolderTree },
  { title: "Tags", navLink: "/tags", icon: Tags },
  { title: "Orders", navLink: "/orders", icon: ShoppingBag },
  { title: "Settings", navLink: "/settings", icon: Settings },
];

export default navItems;
