import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = ({ size = "sm", isdark }: { size?: "sm" | "lg"; isdark?: boolean }) => {
  return (
    <Link href={"/"} className={` rounded-full aspect-square overflow-hidden relative ${size === "sm" ? "w-16 h-16" : "w-44 h-44"}`}>
      <Image src={"/logo1.jpg"} className=" object-cover" alt="logo" fill />
    </Link>
  );
};

export default Logo;
