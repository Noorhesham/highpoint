"use client";
import { useLocale } from "next-intl";
import React from "react";

const NumberFooter = () => {
  const locale = useLocale();
  return (
    <a className=" !text-left underline" href="tel: +971 050 360 6133">
      {locale==='ar'?"6133 360 050 971+":"+971 050 360 6133"}
    </a>
  );
};

export default NumberFooter;
