"use client";
import { BookIcon, FileIcon, FileInputIcon, HomeIcon, House, InfoIcon, SlidersHorizontal } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FaCity } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Menu items.
const items = [
  // {
  //   title: "Dashboard",
  //   url: "/dashboard",
  //   icon: House,
  // },
  {
    title: "Categories",
    url: "/dashboard/category",
    icon: SlidersHorizontal,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: BookIcon,
  },
  {
    title: "Cities",
    url: "/dashboard/city",
    icon: FaCity,
  },
];
const pages = [
  { title: "Home Page", url: "/dashboard/pages/home", icon: HomeIcon },
  { title: "Create New Page", url: "/dashboard/pages/create-page", icon: InfoIcon },
  { title: "My Page", url: "/dashboard/pages/my-pages", icon: FileInputIcon },
  // { title: "Services", url: "/dashboard/pages/services", icon: FileIcon },
];
export function AppSidebar() {
  const pathName = usePathname();
  const locale = useLocale();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="py-32">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Normalize pathName to remove locale and compare URLs correctly.
                const normalizedPath = pathName.replace(`/${locale}/dashboard`, "");
                const isActive = normalizedPath.startsWith(item.url.replace(`/dashboard`, ""));

                return (
                  <SidebarMenuItem key={item.title} className={isActive ? "bg-gray-200 text-blue-600" : ""}>
                    <SidebarMenuButton className="py-3" asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <Accordion type="single" collapsible>
                <AccordionItem value="pages">
                  <AccordionTrigger>Pages</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 ml-2">
                      {pages.map((page) => (
                        <li key={page.title}>
                          <Link href={page.url} className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
                            <page.icon className="w-4 h-4" />
                            {page.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>{" "}
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
