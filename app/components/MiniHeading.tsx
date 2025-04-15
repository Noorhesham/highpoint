import { cn } from "@/lib/utils";
import React from "react";

interface MiniHeadingProps {
  title: string;
  size?: "sm" | "lg" | "xl" | "2xl" | "3xl";
  color?: string;
  bold?: "semi" | "bold" | "mid";
  className?: string;
}

const MiniHeading: React.FC<MiniHeadingProps> = ({ title, size = "lg", color = "black", bold = "mid", className }) => {
  return (
    <h2
      className={cn(`${color || "text-black"} ${className || ""} `, {
        "text-sm": size === "sm",
        "text-lg": size === "lg",
        "text-xl": size === "xl",
        "text-2xl": size === "2xl",
        "text-3xl": size === "3xl",
        "font-semibold": bold === "semi",
        "font-bold": bold === "bold",
        "font-medium": bold === "mid",
      })}
    >
      {title}
    </h2>
  );
};

export default MiniHeading;
