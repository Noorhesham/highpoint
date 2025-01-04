import { getEntities } from "@/app/actions/actions";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const { data: page } = await getEntities("Page", 1, {}, true, "", "", "", {}, { slug: "certificates" });
  const { sections } = page?.data[0];
  console.log(sections);
  return <div></div>;
};

export default page;
