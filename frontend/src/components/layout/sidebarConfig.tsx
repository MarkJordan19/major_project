import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, FolderKanban, Component, Image as ImageIcon, MessageSquareText, Star } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  description: string;
  icon: LucideIcon;
}

export const sidebarConfig: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    description: "Track Designova activity, growth, and recent updates.",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    path: "/projects",
    description: "Shape the portfolio with polished project records.",
    icon: FolderKanban,
  },
  {
    label: "Rooms",
    path: "/rooms",
    description: "Organize spaces, room types, and design notes.",
    icon: Component,
  },
  {
    label: "Images",
    path: "/images",
    description: "Browse the curated Designova stock gallery.",
    icon: ImageIcon,
  },
  {
    label: "Enquiries",
    path: "/dashboard/enquiries",
    description: "Review incoming leads and keep follow-ups moving.",
    icon: MessageSquareText,
  },
  {
    label: "Testimonials",
    path: "/dashboard/testimonials",
    description: "Feature client praise and social proof with confidence.",
    icon: Star,
  },
];
