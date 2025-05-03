"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useLoading } from "../constant/LoadingContext";
import { useTranslations } from "next-intl";
import { FaChevronDown } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

interface Filters {
  [key: string]: string[];
}

const Box = ({
  text,
  options,
  filter,
  btn,
  setDelete,
  del,
}: {
  text: string;
  options?: any[];
  filter: string;
  btn?: boolean;
  setDelete?: any;
  del: any;
}) => {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({});
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);

  const WrapperFn = (fn: any) => {
    startTransition(() => {
      fn();
    });
  };

  // Determine if the viewport is mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse existing filters from the URL when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const newFilters: Filters = {};

      params.forEach((value, key) => {
        newFilters[key] = value.split(",");
      });
      setFilters(newFilters);
    }
  }, []);

  useEffect(() => {
    if (del) resetFilters();
  }, [del]);

  // Update URL when filters change
  const update = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      // Update the params with the current filters state
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.set(key, values.join(",")); // Set the new values for each filter
        } else {
          params.delete(key); // Remove the filter if no values are selected
        }
      });
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (!btn) return;
    WrapperFn(update);
  }, [filters, router]);

  const handleFilter = (filterValue: string, filterName: string) => {
    setFilters((prevFilters) => {
      const currentFilters = prevFilters[filterName] || [];
      const isFilterSelected = currentFilters.includes(filterValue);
      const isCareerType = filterName === "career_type_id";
      // Toggle the filter on/off
      const updatedFilters = isFilterSelected
        ? currentFilters.filter((item) => item !== filterValue) // Remove the filter
        : btn
        ? [filterValue]
        : [...currentFilters, filterValue]; // Add the filter

      if (isFilterSelected && isCareerType) {
        setDelete(true);
      }
      return {
        ...prevFilters,
        [filterName]: updatedFilters,
      };
    });
  };

  const resetFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete(filter);
    params.delete("career_specialty_id");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Get active filters count for this filter type
  const activeFilterCount = filters[filter]?.length || 0;

  return (
    <div ref={dropdownRef} className="relative my-1">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-3 rounded-lg border bg-white transition-colors duration-200 font-medium text-sm",
          isOpen ? "border-main text-main shadow-sm" : "border-gray-300 text-gray-700",
          activeFilterCount > 0 ? "border-main" : ""
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">{t(`${text}.TEXT`)}</span>
          {activeFilterCount > 0 && (
            <span className="bg-main text-white px-2 py-0.5 rounded-full text-xs">{activeFilterCount}</span>
          )}
        </div>
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full min-w-[29rem] bg-white border border-gray-200 rounded-md shadow-lg p-3"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">{t(`${text}.TEXT`)}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[12rem] overflow-y-auto">
              {!btn ? (
                <ul className="space-y-2 mb-3">
                  {options?.map((option, i) => (
                    <li
                      key={i}
                      onClick={() => handleFilter(option.id.toString(), filter)}
                      className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={filter}
                        id={`${filter}-${option.id}`}
                        checked={filters[filter]?.includes(option.id.toString()) || false}
                        className="rounded border-gray-300 text-main focus:ring-main"
                      />
                      <label
                        className="text-sm text-gray-700 text-nowrap cursor-pointer flex-1"
                      >
                        {t(`${option.name}`)}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {options?.map((option, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "text-sm justify-start font-normal",
                        filters[filter]?.includes(option.id.toString())
                          ? "bg-main hover:bg-main/90 text-white border-main"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      )}
                      onClick={() => handleFilter(option.id.toString(), filter)}
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!btn && (
              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-200">
                <button
                  className="px-3 py-1.5 bg-main text-white text-xs rounded-md hover:bg-main/90 transition-colors"
                  onClick={() => {
                    WrapperFn(update);
                    setIsOpen(false);
                  }}
                >
                  {t("Apply")}
                </button>

                {filters[filter]?.length > 0 && (
                  <button
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        [filter]: [],
                      }));
                      WrapperFn(resetFilters);
                    }}
                  >
                    {t("reset")}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Box;
