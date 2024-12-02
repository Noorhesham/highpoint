import React from "react";
import SideNav from "./SideNav";
import {
  BadgeCheck,
  BookIcon,
  BookmarkIcon,
  BriefcaseBusiness,
  CalendarClock,
  HandCoins,
  House,
  LogOutIcon,
  SlidersHorizontal,
  User,
  Users,
} from "lucide-react";
import { MdAddCircle, MdNotifications } from "react-icons/md";
import { FaCity } from "react-icons/fa";
import { useTranslations } from "next-intl";
const iconsStyles = "w-5 h-5";

const SideBar = ({ iconsOnly = false, person }: { iconsOnly?: boolean; person?: boolean }) => {
  const origin = person ? "/person" : "/dashboard";
  const t = useTranslations();
  const navItems = [
    {
      text: "Dashboard",
      link: origin,
      icon: <House className={iconsStyles} />,
    },
    {
      text: "Categories",
      link: `${origin}/category`,
      icon: <SlidersHorizontal className={iconsStyles} />,
    },
    {
      text: "Courses",
      link: `${origin}/courses`,
      icon: <BookIcon className={iconsStyles} />,
    },
    { text: "Cities", link: `${origin}/city`, icon: <FaCity className={iconsStyles} /> },
  ];
  return (
    <div
      className={`flex items-center ${
        iconsOnly ? "sticky top-0" : "lg:sticky lg:top-0"
      } lg bg-light rounded-xl h-fit  pb-5 flex-col  col-span-full lg:col-span-2 gap-3`}
    >
      <h1 className="py-3 text-left mt-4 text-gray-900 font-semibold">{!iconsOnly ? "DASHBOARD" : "HIGH POINT"}</h1>
      <ul
        style={iconsOnly ? { alignItems: "center", padding: "15px" } : {}}
        className={`text-xs :text-sm items-start ${
          !iconsOnly ? "grid grid-cols-2  w-full  text-base" : "flex flex-col"
        } md:flex md:flex-col flex-nowrap md:flex-wrap gap-5 mt-3 lg:flex-col  font-semibold`}
      >
        {navItems.map((item, index) => (
          <SideNav iconsOnly={iconsOnly} key={index} link={item.link} text={item.text} icon={item.icon} />
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
