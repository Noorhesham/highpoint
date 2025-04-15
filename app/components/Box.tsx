"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useLoading } from "../constant/LoadingContext";
import { useTranslations } from "next-intl";

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
  const [accordionValue, setAccordionValue] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { setIsLoading } = useLoading();

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
      setAccordionValue(mobile ? undefined : "item-1");
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
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
      // } else
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
  const t = useTranslations();
  return (
    <div className="flex px-3 py-1.5 font-medium text-sm bg-white   capitalize flex-col">
      <Accordion
        type="single"
        value={accordionValue} // Control the accordion value
        onValueChange={setAccordionValue} // Update the state when it changes
        collapsible
        className="w-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <h2 className="text-base font-semibold text-main2">{t(`${text}.TEXT`)}</h2>
          </AccordionTrigger>{" "}
          <AccordionContent className=" max-h-[10rem] overflow-auto flex flex-col gap-2">
            <ul className="pb-3 grid   grid-cols-1 lg:grid-cols-2 gap-2 border-b border-b-gray-400">
              {!btn
                ? options?.map((option, i) => (
                    <li
                      onClick={() => handleFilter(option.id.toString(), filter)}
                      key={i}
                      className="flex items-center text-xs w-full gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={filter}
                        id={option}
                        checked={filters[filter]?.includes(option.id.toString()) || false}
                      />
                      <label className="text-main2  line-clamp-2  text-xs w-full" htmlFor={option.name}>
                        {t(`${option.name}`)}
                      </label>
                    </li>
                  ))
                : options?.map((option, i) => {
                    return (
                      <Button
                        size={"lg"}
                        className={cn(
                          "w-full lg:text-[10px] text-wrap line-clamp-2 !px-3  col-span-2 xl:col-span-1 bg-gray-100 text-main2 ",
                          filters[filter]?.includes(option.id.toString())
                            ? "bg-main2 hover:bg-main2  hover:text-white text-gray-50"
                            : ""
                        )}
                        variant={"outline"}
                        key={i}
                        onClick={() => {
                          handleFilter(option.id.toString(), filter);
                        }}
                      >
                       {option.name}
                      </Button>
                    );
                  })}
            </ul>
          </AccordionContent>{" "}
          {!btn && (
            <div className="flex gap-2 items-center mb-2 mt-5  ml-auto">
              <button className=" py-1 text-white  px-4 bg-main  rounded-full" onClick={() => WrapperFn(update)}>
                Filter
              </button>
              {filters[filter]?.length > 0 && (
                <button
                  className=" py-1 text-white  px-4 bg-gray-300  rounded-full"
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
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Box;
