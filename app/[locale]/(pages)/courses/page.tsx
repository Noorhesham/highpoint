import { PaginationDemo } from "@/app/components/Pagination";
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
      {/* <PaginationDemo totalPages={1} /> */}
    </section>
  );
};

export default page;
