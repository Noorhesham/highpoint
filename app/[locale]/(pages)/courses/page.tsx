import { getEntities } from "@/app/actions/actions";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import FilterMobile from "@/app/components/FilterPhone";
import Filters from "@/app/components/Filters";
import { ProductLoader } from "@/app/components/ProductReel";
import ProductReelFetch from "@/app/components/ProductReelFetch";
import SearchBox from "@/app/components/SearchBox";
import { unstable_setRequestLocale } from "next-intl/server";
import React, { Suspense } from "react";

const Page = async ({
  params: { locale },
  searchParams: { page, category, subCategories, city, startDate, endDate },
}: {
  params: { locale: string };
  searchParams: {
    page: string;
    category: string;
    subCategories: string;
    city: string;
    startDate: string;
    endDate: string;
  };
}) => {
  unstable_setRequestLocale(locale);

  const filters = {
    category: category || "",
    subCategories: subCategories ? subCategories.split(",") : [],
    city: city || "",
    startDate: startDate || "",
    endDate: endDate || "",
    status: "published",
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
    <MaxWidthWrapper className="  mt-32 lg:mt-40" noPadding>
      {" "}
      <GridContainer className=" gap-5" cols={10}>
        <div className=" col-span-full lg:hidden   block">
          <FilterMobile filters={filterss} />
        </div>
        <Suspense
          fallback={
            <div className="w-full  order-2 grid  grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 md:gap-y-10 lg:gap-x-8 flex-grow">
              <ProductLoader />
            </div>
          }
        >
          <ProductReelFetch registerNow={false} filter={filters} page={parseInt(page) || 1} locale={locale} />
        </Suspense>
        <div className="  order-1 col-span-full relative lg:col-span-3">
          <div className=" sticky top-0 lg:block hidden ">
            <Filters filters={filterss} />
          </div>
        </div>
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default Page;
