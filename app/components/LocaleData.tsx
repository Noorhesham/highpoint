"use client";
import { useLocale } from "next-intl";
import React from "react";
import { convertToHTML } from "../utils/fn";

const LocaleData = ({ data }: { data: any }) => {
  const locale = useLocale();
  return (
    <div
      className="prose dark:prose-invert line-clamp-2"
      dangerouslySetInnerHTML={{
        __html: convertToHTML(data?.[locale] || ""),
      }}
    />
  );
};

export default LocaleData;
