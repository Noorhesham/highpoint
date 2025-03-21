"use client";
import React, { useEffect, useTransition } from "react";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { ProductLoader } from "./ProductReel";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import Paragraph from "./defaults/Paragraph";

const ProductCard = ({ product, index, category = false }: { product: any; index: number; category?: boolean }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const locale = useLocale();
  const t = useTranslations();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);
  return isVisible ? (
    <Link className=" bg-white h-full" href={category ? `/courses?category=${product._id}` : `/course/${product._id}`}>
      <div
        className={`${cn(" opacity-0  bg-white h-full h-full relative w-full cursor-pointer group-main ", {
          " opacity-100 animate-in duration-200 fade-in-5 shadow-md  rounded-xl": isVisible,
        })} self-stretch flex flex-col `}
      >
        <ImageSlider
          stock={product.stock}
          productId={product._id}
          urls={product.images.map((image: any) => image.secure_url || "/default.jpg")}
        />
        <div className=" flex flex-col self-stretch justify-between py-2 px-4 w-full">
          <div className="flex items-start flex-col justify-between">
            {!category && (
              <div className=" flex items-start flex-col ">
                <p className=" mt-1 text-main font-semibold text-sm ">
                  {t("category.title")} : {product.category?.name[locale || "en"]}
                </p>
              </div>
            )}
            <h3 className="font-medium text-base  ">
              {product?.name?.length > 20
                ? product?.name?.substring(0, 20) + "..."
                : product.name?.[locale || "en" || "ar"] || ""}
            </h3>{" "}
          </div>
          {product.price && <p className=" mt-1 font-medium text-sm ">{product.price}$</p>}
          {product.shortDescription && (
            <Paragraph description={product.shortDescription[locale || "en"]} className="!line-clamp-2" />
          )}
        </div>
      </div>
    </Link>
  ) : (
    <ProductLoader />
  );
};

export default ProductCard;
