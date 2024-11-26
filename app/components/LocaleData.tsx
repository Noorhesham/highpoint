"use client";
import { useLocale } from "next-intl";
import React from "react";

const LocaleData = ({ data }: { data: any }) => {
  const locale = useLocale();
  return <p className=" lg:text-base text-black ">{data?.[locale]}</p>;
};

export default LocaleData;
