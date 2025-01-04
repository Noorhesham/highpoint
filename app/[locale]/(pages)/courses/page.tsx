import { getEntities } from "@/app/actions/actions";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import FilterMobile from "@/app/components/FilterPhone";
import Filters from "@/app/components/Filters";
import ProductReelFetch from "@/app/components/ProductReelFetch";
import { unstable_setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

const Page = async ({
  params: { locale },
  searchParams: { page, category, subCategories, city },
}: {
  params: { locale: string };
  searchParams: { page: string; category: string; subCategories: string; city: string };
}) => {
  unstable_setRequestLocale(locale);

  const filters = {
    category: category || "",
    subCategories: subCategories ? subCategories.split("%2C") : [],
    city: city || "",
  };
  const categories = await getEntities("Category");
  const cities = await getEntities("City");

  const subCategories2 = categories.data?.data.find(
    (category: any) => category._id === filters.category
  )?.subCategories;
  const filterss = [
    { Categories: categories.data?.data, filter: "category" },
    { "Sub Categories": subCategories2 || [], arr: true, filter: "subCategories" },
    { Cities: cities.data?.data || [], filter: "city" },
  ];
  return (
    <MaxWidthWrapper className=" mt-20 lg:mt-40" noPadding>
      {" "}
      <GridContainer className=" gap-5" cols={10}>
        <Suspense fallback={<p>Loading courses...</p>}>
          <ProductReelFetch filter={filters} page={parseInt(page) || 1} locale={locale} />
        </Suspense>
        <div className=" col-span-2 lg:col-span-3">
          <div className=" lg:block hidden ">
            <Filters filters={filterss} />
          </div>
          <FilterMobile filters={filterss} />
        </div>
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default Page;
