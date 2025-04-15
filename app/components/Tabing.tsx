"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Calendar, Users, Info } from "lucide-react";

interface TabingProps {
  defaultValue: string;
  options: {
    label: string;
    content: ReactNode;
    href: string;
    icon?: "overview" | "outline" | "npc" | "schedule" | string;
  }[];
}

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
    currentParams.set("section", href);
    router.push(`${window.location.pathname}?${currentParams.toString()}`, { scroll: false });
    setCurrentPath(href);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "overview":
        return <Info className="w-4 h-4 mr-2" />;
      case "outline":
        return <FileText className="w-4 h-4 mr-2" />;
      case "npc":
        return <Users className="w-4 h-4 mr-2" />;
      case "schedule":
        return <Calendar className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full border-b border-gray-200">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleClick(option.href)}
            className={cn(
              "flex items-center w-full justify-center py-3 px-4 text-sm font-medium transition-colors relative",
              "focus:outline-none hover:bg-[#2980b9]",
              currentPath === option.href ? "bg-[#3498db] text-white" : "bg-[#2c3e50] text-white/80 hover:text-white"
            )}
          >
            {option.icon && getIcon(option.icon)}
            <span>{option.label.length > 20 ? option.label.slice(0, 20) + "..." : option.label}</span>
            {currentPath === option.href && <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>}
          </button>
        ))}
      </div>
      <div className="overflow-hidden h-full min-h-[8vh] mt-8">
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
