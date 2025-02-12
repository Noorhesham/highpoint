"use client";
import { useLocale } from "next-intl";
import React from "react";

const NumberFooter = () => {
  const locale = useLocale();
  return (
    <div>
      <a className=" items-center gap-2 flex !text-left underline" href="tel: +971 50 360 6133">
        {locale === "ar" ? "6133 360 50 971+" : "+971 50 360 6133"}
      </a>
      <a className=" items-center gap-2 flex !text-left underline" href="tel:050 360 6133">
        {locale === "ar" ? "6133 360 050" : "050 360 6133"}
      </a>
    </div>
  );
};

export default NumberFooter;
