"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageSlider from "./ImageSlider";
import ModalCustom from "./defaults/ModalCustom";
import ApplicantForm from "./forms/ApplicantForm";
import { Calendar, PlaneIcon } from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";

export const ProductLoader = () => {
  return (
    <div className="w-full h-[400px] bg-white rounded-xl animate-pulse">
      <div className="h-[180px] bg-gray-200 rounded-t-xl"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: any;
  index: number;
  category?: boolean;
  registerNow?: boolean;
}

export default function ProductCard({ product, index, category = false, registerNow = true }: ProductCardProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const startDate = product.startDate ? formatDate(product.startDate) : "";
  const endDate = product.endDate ? formatDate(product.endDate) : "";
  const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : "";

  return isVisible ? (
    <Link
      className="block !rounded-2xl h-full"
      href={category ? `/courses?category=${product._id}` : `/course/${product._id}`}
    >
      <div
        className={cn(
          "opacity-0 h-full relative w-full cursor-pointer overflow-hidden border-0  !rounded-2xl shadow-lg  overflow-hidden",
          {
            "opacity-100 animate-in duration-200 fade-in-5": isVisible,
          }
        )}
      >
        {/* Blue header with circular logo */}
        <ImageSlider urls={product.images.map((image: any) => image.secure_url)} productId={product._id} />
        <h3 className="text-start p-1 text-base line-clamp-1 font-bold text-black">
          {product.name?.[locale || "en"] || ""}
        </h3>
        {/* Course details with orange bullet points */}
        <div className="bg-white py-2 px-4">
          <ul className=" my-1">
            {dateRange && (
              <li className="flex items-center gap-2">
                <div className="mt-1 flex items-center   justify-center h-6 w-6 min-w-4 rounded-sm bg-[#e67e22]">
                  <Calendar className="h-4 w-4 text-blue-200 " />
                </div>
                <span className="text-xs">{dateRange}</span>
              </li>
            )}

            {product.city && (
              <li className="flex items-center gap-2">
                <div className="mt-1 flex items-center   justify-center h-6 w-6 min-w-6 rounded-sm bg-[#e67e22]">
                  <PlaneIcon className="h-4 w-4  text-blue-200" />
                </div>
                <span className="text-xs">{product.city.name[locale || "en"]}</span>
              </li>
            )}

            {!category && product.category && (
              <li className="flex items-center gap-2">
                <div className="mt-1 flex items-center   justify-center h-6 w-6 min-w-6 rounded-sm bg-[#e67e22]">
                  <DashboardIcon className="h-4 w-4 text-blue-200 " />
                </div>
                <span className="text-xs">{product.category?.name[locale || "en"]}</span>
              </li>
            )}
          </ul>{" "}
          {registerNow && (
            <Link className=" mt-5 pt-5 w-[80%] mx-auto" href={`/course/${product._id}`}>
              <Button className="text-gray-50 bg-main hover:bg-main/80 w-full duration-150" size={"sm"}>
                {t("registerNow")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Link>
  ) : (
    <ProductLoader />
  );
}
