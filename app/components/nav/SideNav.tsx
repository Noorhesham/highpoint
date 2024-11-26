"use client";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const SideNav = ({
  icon,
  text,
  link,
  iconsOnly,
}: {
  icon: React.ReactNode;
  text: string;
  link: string;
  iconsOnly?: boolean;
}) => {
  const [mounted, setMounted] = useState(false);
  const pathName = usePathname();
  const lang = useLocale();
  const isActive = pathName.replace(`/${lang}`, "") === `${link}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <Link
        href={link}
        className={`flex flex-1  text-base flex-grow w-full lg:py-2  hover:bg-gray-100 lg:px-4 font-medium duration-150 cursor-pointer md:w-full rounded-lg p-1    items-center gap-2 self-start ${
          isActive && !iconsOnly
            ? " bg-hover  border-l-2 rounded-l-none   duration-150  border-main2 lg:py-3   text-main2 hover:bg-gray-100 "
            : iconsOnly && isActive
            ? "bg-main2 w-fit hover:bg-gray-100  text-gray-50 text-center mx-auto"
            : ""
        }`}
      >
        <p>{text}</p>
      </Link>
    )
  );
};

export default SideNav;
