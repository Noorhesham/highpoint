import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getGenralSettings, useGetEntity } from "../queries";

const Logo = ({ size = "sm", isdark }: { size?: "sm" | "lg"; isdark?: boolean }) => {
  const { data, isLoading } = getGenralSettings();
  return (
    <Link
      href={"/"}
      className={` rounded-full aspect-square overflow-hidden relative ${size === "sm" ? "h-16 w-fit " : "w-52 h-52"}`}
    >
      <Image
        src={!isLoading && !data ? "/photo_2024-12-03_13-07-38-removebg-preview.png" : data?.data.logo}
        className=" object-left object-contain"
        alt="logo"
        fill
      />
    </Link>
  );
};

export default Logo;
