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
    <p
      className={` ${className || "text-gray-100"} text-base  ${size === "lg" ? "text-lg" : "text-base"} ${
        full ? "max-w-full" : maxWidth ? "lg:max-w-5xl" : "lg:max-w-xl"
      } font-medium my-2 leading-[1.7] `}
    >
      {description}
    </p>
  );
};

export default Paragraph;