import { cn } from "@/lib/utils";
import React from "react";

const Head = ({ text, className }: { text: string; className?: string }) => {
  return <h1 className={cn("lg:text-3xl text-3xl  font-bold", className ?? " text-black")}>{text}</h1>;
};

export default Head;
