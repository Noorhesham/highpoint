import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ size = "sm", isdark }: { size?: "sm" | "lg"; isdark?: boolean }) => {
  return (
    <Link
      href={"/"}
      className={` rounded-full aspect-square overflow-hidden relative ${size === "sm" ? "h-16 w-64 " : "w-52 h-52"}`}
    >
      <Image src ={"/photo_2024-12-03_13-07-38-removebg-preview.png"} className=" object-contain" alt="logo" fill />
    </Link>
  );
};

export default Logo;
