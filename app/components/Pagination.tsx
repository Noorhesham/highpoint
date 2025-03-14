"use client";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSetLoading } from "../hooks/useIsLoading";
import { useLocale } from "next-intl";

export function PaginationDemo({ totalPages = 5 }: { totalPages?: number }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { WrapperFn } = useSetLoading();
  const locale = useLocale();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    replace(url.toString(), { scroll: false });
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const visiblePages = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" onClick={(e) => handlePageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            className={currentPage === i ? "bg-main2 text-gray-50 rounded-full" : "rounded-full"}
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              WrapperFn(() => handlePageChange(i));
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" onClick={(e) => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <Pagination className="mt-10 col-span-full overflow-x-auto">
      <PaginationContent>
        <PaginationItem>
          <button
            className={`rounded-full ${
              currentPage <= 1 ? "cursor-not-allowed opacity-50" : ""
            } w-fit flex mr-1 md:mr-3 p-1 items-center text-main2 bg-light duration-150 hover:text-white hover:bg-main2`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) WrapperFn(() => handlePageChange(currentPage - 1));
            }}
            disabled={currentPage <= 1}
          >
            {locale === "ar" ? <ArrowRight className="mr-1" /> : <ArrowLeft className="mr-1" />}
          </button>
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <button
            className={`rounded-full ${
              currentPage >= totalPages ? "cursor-not-allowed opacity-50" : ""
            } bg-light text-main2 ml-1 md:ml-3 p-1 flex items-center duration-150 hover:text-white hover:bg-main2`}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) WrapperFn(() => handlePageChange(currentPage + 1));
            }}
            disabled={currentPage >= totalPages}
          >
            {locale === "ar" ? <ArrowLeft className="mr-1" /> : <ArrowRight className="mr-1" />}
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
