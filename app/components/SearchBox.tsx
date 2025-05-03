"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import debounce from "lodash.debounce";
import Link from "next/link";
import MotionItem from "./defaults/MotionItem";
import { Button } from "@/components/ui/button";
import { SearchIcon, XIcon } from "lucide-react";
import { useGetEntity } from "../queries";
import Image from "next/image";
import { CourseProps } from "../models/Course";

const SearchBox = ({
  bg,
  icon,
  onSearch,
  active,
  setIsActive,
  nonactive,
  btn = true,
  onClose,
  className,
  defaultQuery,
}: {
  bg?: string;
  icon?: any;
  onSearch?: (value: string) => void;
  active?: boolean;
  setIsActive?: (value: boolean) => void;
  nonactive?: boolean;
  btn?: boolean;
  onClose?: () => void;
  className?: string;
  defaultQuery?: string;
}) => {
  //2 states to handle the debounced search
  const [val, setVal] = useState(defaultQuery || "");
  const [query, setQuery] = useState<string>("");

  //state to track down the activity of the results (if the box is shown or not)
  const [resultActive, setResultActive] = useState(false);
  //the selected result state to adda visual effect when moving with keys
  const [selectedResult, setSelectedResult] = useState(0);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = new URLSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  useEffect(() => {
    searchParams.set("search", query);
  }, [query]);
  const { data, isLoading } = useGetEntity({
    entityName: "Course",
    key: `search-${query}`,
    seachTerm: query,
    searchField: `name.${locale}`,
    filter: { status: "published" },
  });

  const search = React.useCallback(
    debounce((newsearch) => {
      setQuery(newsearch.trim());
    }, 500),
    [query]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(event.target.value);
    if (!nonactive && (event.target.value.includes("%") || event.target.value.length < 3))
      return setResultActive(false);
    setResultActive(true);
    onSearch && onSearch(event.target.value);
    if (!nonactive) search(event.target.value);
  };

  // Handle clicks outside the search box to close it
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setResultActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // When active state changes, focus the input if active
  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  const jobs = data?.data?.data || [];
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (jobs?.length < 1 || nonactive) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedResult((prev) => {
        const next = (prev + 1) % jobs.length;
        itemRefs.current[next]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return next;
      });
    }
    if (event.key === "escape") setResultActive(false);
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedResult((prev) => {
        const next = (prev - 1 + jobs.length) % jobs.length;
        itemRefs.current[next]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
        return next;
      });
    }

    if (event.key === "Enter" && jobs) {
      if (selectedResult) router.push(`/course/${jobs[selectedResult]._id}`);
    }
  };
  console.log(jobs);
  return (
    <div ref={containerRef} className={`${className || " md:w-[80%]"} w-full relative flex flex-col gap-4  `}>
      {" "}
      <AnimatePresence>
        {data && resultActive && (
          <MotionItem
            nohover
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`${
              locale === "ar" ? "right-0" : "left-0"
            } flex w-full  bg-white z-40 items-start  xl:w-full  absolute gap-2  top-[104%] py-4  px-2 lg:px-8 rounded-md  max-h-[14rem] overflow-y-scroll flex-col `}
          >
            {jobs && jobs.length > 0 ? (
              jobs?.map((item: CourseProps, index: number) => (
                <Link
                  ref={(el) => (itemRefs.current[index] = el)}
                  key={item.id}
                  href={`/course/${item._id}`}
                  className={`${
                    selectedResult === index ? "bg-gray-100" : ""
                  }  hover:bg-gray-100 rounded-xl lg:py-2 text-base lg:px-4 duration-150 w-full flex items-center gap-2`}
                >
                  {item.images?.[0]?.secure_url && (
                    <div className=" w-14 h-14  rounded-xl overflow-hidden relative">
                      <Image src={item.images?.[0]?.secure_url} alt="" fill className=" object-cover" />
                    </div>
                  )}
                  <div className=" flex flex-col">
                    <h2 className=" text-blackline-clamp-1 font-medium rounded-xl">{item?.name?.[locale] || ""}</h2>
                  </div>
                </Link>
              ))
            ) : (
              <p className=" text-main uppercase text-xs">No results Found</p>
            )}
            <Link
              className=" text-main duration-150 hover:underline"
              href={jobs?.length > 1 ? `/courses?search=${query}` : "/courses"}
            >
              {`${jobs?.length > 1 ? `Browse All Courses For ${query}` : "View All Courses"}`}
            </Link>
          </MotionItem>
        )}
      </AnimatePresence>
      <div className="bg-white gap-4 sm:gap-2 flex-row  py-3 px-6 rounded-xl flex items-center w-full ">
        <div className=" flex bg-white w-full overflow-hidden relative rounded-xl border-primary border-2">
          <div className="flex w-full items-center justify-between py-2 px-8">
            <input
              onKeyDown={handleKeyDown}
              value={val}
              onChange={handleSearchChange}
              className=" w-full outline-none"
              type="text"
              placeholder={t("search")}
            />{" "}
            <XIcon
              onClick={() => {
                onClose && onClose();
                setVal("");
                setResultActive(false);
              }}
              className=" cursor-pointer hover:text-main duration-150 mr-2"
            />
          </div>{" "}
        </div>
        <Link
          href={jobs?.length > 1 ? `/courses?query=${query}` : "/courses"}
          className=" p-2 rounded-xl  text-white justify-center items-center bg-main"
        >
          <SearchIcon className=" w-5 h-5" />
        </Link>{" "}
      </div>
    </div>
  );
};

export default SearchBox;
