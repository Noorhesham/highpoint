import { convertToHTML } from "@/app/utils/fn";
import React from "react";

const Paragraph = ({
  description,
  size = "sm",
  full = false,
  className,
  maxWidth,
}: {
  description: string;
  size?: "sm" | "lg";
  full?: boolean;
  className?: string;
  maxWidth?: boolean;
}) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: convertToHTML(description || ""),
      }}
      className={` ${className || "text-gray-80 font-medium"} text-sm  ${size === "lg" ? "text-lg" : "text-base"} ${
        full ? "max-w-7xl" : maxWidth ? "lg:max-w-5xl" : "lg:max-w-xl"
      }  my-2 leading-[1.7] `}
    />
  );
};

export default Paragraph;
