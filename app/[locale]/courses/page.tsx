import ProductReelFetch from "@/app/components/ProductReelFetch";
import { unstable_setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

const page = ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  return (
    <section>
      <Suspense>
        <ProductReelFetch />
      </Suspense>
    </section>
  );
};

export default page;
