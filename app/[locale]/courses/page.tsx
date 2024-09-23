import ProductReelFetch from "@/app/components/ProductReelFetch";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

const page = ({params: {locale}}: {params: {locale: string}}) => {
    unstable_setRequestLocale(locale)
  return (
    <section>
      <ProductReelFetch />
    </section>
  );
};

export default page;
