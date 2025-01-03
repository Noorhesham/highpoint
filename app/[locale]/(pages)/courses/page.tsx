import ProductReelFetch from "@/app/components/ProductReelFetch";
import { unstable_setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

const page = ({
  params: { locale },
  searchParams: { page },
}: {
  params: { locale: string };
  searchParams: { page: string };
}) => {
  unstable_setRequestLocale(locale);
  return (
    <section>
      <Suspense>
        <ProductReelFetch page={page || 1} />
      </Suspense>
    </section>
  );
};

export default page;
