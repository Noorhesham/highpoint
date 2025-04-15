"use client";

import {
  BookIcon,
  FileIcon,
  FileInputIcon,
  Home,
  HomeIcon,
  House,
  InfoIcon,
  SlidersHorizontal,
  User,
} from "lucide-react";
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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MdPeople } from "react-icons/md";

// Menu items
const items = [
  { key: "highpoint", url: "/dashboard/", icon: Home },
  { key: "categories", url: "/dashboard/category", icon: SlidersHorizontal },
  { key: "courses", url: "/dashboard/courses", icon: BookIcon },
  { key: "cities", url: "/dashboard/city", icon: FaCity },
  { key: "applicants", url: "/dashboard/applicants", icon: MdPeople },
  { key: "users", url: "/dashboard/users/", icon: User },
];

const pages = [
  { key: "homePage", url: "/dashboard/pages/home", icon: HomeIcon },
  { key: "createPage", url: "/dashboard/pages/create-page", icon: InfoIcon },
  { key: "myPages", url: "/dashboard/pages/my-pages", icon: FileInputIcon },
];

export function AppSidebar() {
  const pathName = usePathname();
  const locale = useLocale();
  const t = useTranslations("Sidebar");

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="py-32">
          <SidebarGroupLabel>{t("application")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                // Normalize pathName to remove locale and compare URLs correctly
                const normalizedPath = pathName.replace(`/${locale}/dashboard`, "");
                const isActive = normalizedPath.startsWith(item.url.replace(`/dashboard`, ""));

                return (
                  <SidebarMenuItem key={item.key} className={isActive ? "bg-gray-200 text-main" : ""}>
                    <SidebarMenuButton className="py-3" asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon />
                        <span>{t(`menu.${item.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <Accordion type="single" collapsible>
                <AccordionItem value="pages">
                  <AccordionTrigger>{t("pages")}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 ml-2">
                      {pages.map((page) => (
                        <li key={page.key}>
                          <Link href={page.url} className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
                            <page.icon className="w-4 h-4" />
                            {t(`menu.${page.key}`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
