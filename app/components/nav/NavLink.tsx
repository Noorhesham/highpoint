import Link from "next/link";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

const NavLink = ({
  text,
  href,
  subLinks,
  isHome,
}: {
  text: string;
  href?: string;
  subLinks: { text: string; href?: string }[];
  isHome?: boolean;
}) => {
  const pathName = usePathname();
  const local = useLocale();
  const linkStyles =
    "uppercase  text-gray-800 font-semibold  group flex relative items-center gap-2 text-sm  xl:text-sm  ";
  const active = isHome
    ? pathName.replace(`/${local}`, "").trim() === href?.replace(`/`, "").trim()
    : pathName.replace(`/${local}`, "") === href;
  if (!subLinks)
    return (
      <Link
        href={href || "/"}
        className={`${linkStyles} ${
          active
            ? `text-primary 
       after:w-full after:h-[2px]  after:bg-main  after:absolute after:-bottom-1 w-fit after:left-0`
            : "after:w-0 "
        } hover:after:bg-yellow-400 hover:after:w-full after:duration-150 after:absolute after:-bottom-1  after:left-0 hover:after:h-[2px]`}
      >
        {text}
      </Link>
    );
  else
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger  className={linkStyles}>
          {text} <ChevronDown className=" w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className=" w-full rounded-lg">
          {subLinks.map((link) => (
            <DropdownMenuItem className=" uppercase   rounded-sm" key={link.text}>
              <Link className=" text-xs  px-5   py-2  w-full   font-semibold  uppercase" href={link.href || "#"}>
                {link.text}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
};

export default NavLink;
