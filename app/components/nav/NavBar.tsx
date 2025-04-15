"use client";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import NavLink from "./NavLink";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import { usePathname, useRouter } from "next/navigation";
import PhoneNav from "./PhoneNav";
import MotionItem from "../defaults/MotionItem";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Language from "../Language";
import User from "../User";
import { MdEmail } from "react-icons/md";
import { Phone } from "lucide-react";

const NavBar = () => {
  const t = useTranslations();
  const links = [
    {
      text: t("nav.home"),
      href: "/",
    },
    {
      text: t("nav.courses"),
      href: "/courses",
    },

    {
      text: t("nav.aboutus"),
      subLinks: [
        { text: t("nav.who-we-are"), href: "/about-us" },
        { text: t("nav.certificates"), href: "/certificates" },
        { text: t("nav.clients"), href: "/clients" },
        // {
        //   text: t("nav.opinions"),
        //   href: "/opinions",
        // },
        // {
        //   text: t("nav.blogs"),
        //   href: "/blogs",
        // },
        // {
        //   text: t("nav.faq"),
        //   href: "/faq",
        // },
      ],
    },
    // {
    //   text: t("nav.contactus.text"),
    //   subLinks: [
    //     { text: t("nav.contactus.sublinks.inquiry"), href: "/contactus/inquiry" },
    //     { text: t("nav.contactus.sublinks.hotelbooking"), href: "/contactus/hotelbooking" },
    //     { text: t("nav.contactus.sublinks.mailinglist"), href: "/contactus/mailinglist" },
    //     { text: t("nav.contactus.sublinks.careers"), href: "/contactus/careers" },
    //   ],
    // },
  ];
  const links2 = [
    {
      text: t("nav2.search"),
      href: "/courses",
    },
    {
      text: t("nav2.guide"),
      href: "/categories",
    },
    {
      text: t("nav2.places"),
      href: "/places",
    },
    {
      text: t("nav2.certificates"),
      href: "/certificates",
    },
    // {
    //   text: t("nav2.train-tech"),
    //   href: "/train",
    // },
  ];

  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [active, setIsActive] = useState(false);
  const router = useRouter();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTopPage, setIsTopPage] = useState(true);
  const pathName = usePathname();
  const user = false;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setIsTopPage(true);
      } else setIsTopPage(false);
      if (window.scrollY > lastScrollY) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isTopPage]);
  const isHome = pathName === "/en" || pathName === "/ar";
  const locale = useLocale();
  const isInDashboard = pathName.includes("dashboard");
  return (
    <header className=" w-full">
      <nav
        className={`${
          isHome
            ? "text-gray-900 font-semibold placeholder:text-gray-800 "
            : `    font-semibold placeholder:text-gray-50"  ${isScrollingDown && "bg-white"}`
        } fixed inset-0 z-50 max-h-[5rem] lg:max-h-[8.5rem]  bg-white flex flex-col gap-2   transition-all duration-300 ${
          isScrollingDown
            ? "translate-y-[-110%]"
            : !isTopPage && !isScrollingDown
            ? `  -translate-y-2 lg:-translate-y-5 ${!isHome && "bg-white"}`
            : "translate-y-0"
        }`}
      >
        <div
          className="flex   flex-col gap-2
        "
        >
          <div className=" w-full bg-gray-100 py-3 ">
            <MaxWidthWrapper noPadding className={`  flex justify-between `}>
              {" "}
              <div className=" ml-5 hidden lg:flex z-30 relative items-center  gap-4 xl:gap-8 ">
                {links.map((link) => (
                  //@ts-ignore
                  <NavLink isHome={isHome} key={link.text} href={link.href} text={link.text} subLinks={link.subLinks} />
                ))}
              </div>
              <div className="  flex items-center gap-2 ">
                <div className={`z-[999] duration-150 h-full  relative lg:hidden block`}>
                  <PhoneNav navigation={links} />
                  <div className=" flex ">
                    <Logo size="sm" isdark={isHome ? false : true} />
                  </div>
                </div>
                {isInDashboard && <User />} <Language />
              </div>
            </MaxWidthWrapper>
          </div>

          <MaxWidthWrapper noPadding className="flex justify-between items-center">
            {" "}
            <div className=" hidden lg:flex z-30 relative items-center  gap-4 xl:gap-8 ">
              {links2.map((link) => (
                //@ts-ignore
                <NavLink isHome={isHome} key={link.text} href={link.href} text={link.text} subLinks={link.subLinks} />
              ))}
            </div>
            <div
              className={`${
                !isTopPage && "lg:opacity-100  hidden lg:flex  opacity-0"
              }  duration-150  self-end  lg:flex hidden items-center`}
            >
              <Logo isdark={isHome ? false : true} />
            </div>
          </MaxWidthWrapper>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
