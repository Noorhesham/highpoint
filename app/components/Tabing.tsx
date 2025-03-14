"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
interface TabingProps {
  defaultValue: string;
  options: { label: string; content: ReactNode; href: string }[];
}
import { AnimatePresence, motion } from "framer-motion";
const Tabing = ({ defaultValue, options }: TabingProps) => {
  const searchParams = useSearchParams();

  const category = searchParams.get("section");
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    if (category && window.location.search.includes(category)) setCurrentPath(category);
    else setCurrentPath(defaultValue);
  }, [category, defaultValue]);

  const handleClick = (href: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("section", href); // Update or add the "section" parameter
    router.push(`${window.location.pathname}?${currentParams.toString()}`, { scroll: false });
    setCurrentPath(href);
  };
  return (
    <div className="w-full  ">
      <div className="flex flex-wrap w-full   items-center gap-3">
        {options.map((option, i) => (
          <Button
            key={i}
            size={"lg"}
            onClick={() => handleClick(option.href)}
            className={` ${
              currentPath === option.href
                ? " bg-main hover:bg-white hover:main/60  text-gray-50"
                : "bg-white text-main main/60"
            } text-sm  md:text-base flex-1  hover:bg-main  hover:text-white border border-blue-600 w-fit duration-150`}
          >
            <div>{option.label.length > 20 ? option.label.slice(0, 20) + "..." : option.label}</div>
          </Button>
        ))}
      </div>
      <div className="overflow-hidden h-full min-h-[8vh]   mt-8">
        <AnimatePresence mode="wait">
          {options.map(
            (option) =>
              option.href === currentPath && (
                <motion.div
                  key={option.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {option.content}
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabing;
