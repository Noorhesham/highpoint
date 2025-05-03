import React, { Suspense } from "react";
import { unstable_cache } from "next/cache";
import ProductCard from "./Product";
import GridContainer from "./defaults/GridContainer";
import { PaginationDemo } from "./Pagination";
import Empty from "./Empty";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { getEntities } from "../actions/actions";
import { getTranslations } from "next-intl/server";

const fetchProducts = async (page: number, filter: any) => {
  return await getEntities("Course", page, filter || {}, false, "category", "", "", {}, {}, 9);
};

const cachedFetchProducts = (page: number, filter: any, locale: string) =>
  unstable_cache(() => fetchProducts(page, filter), [`Course-${page}-${JSON.stringify(filter)}`], {
    revalidate: 60,
    tags: [`Course`],
  });
const ProductReelFetch = async ({
  page = 1,
  filter = {},
  locale = "en",
  registerNow,
}: {
  page: number;
  filter: any;
  locale?: string;
  registerNow?: boolean;
}) => {
  // Use the cached function to fetch products with the specific page and filter,
  const res = await fetchProducts(page, filter, locale);
  const t = await getTranslations();
  console.log(res.data?.data);
  if (!res || !res.data) {
    return null;
  }

  const { data, totalPages } = res.data;
  const courses = data;

  return (
    <Suspense>
      {" "}
      <section className="col-span-full lg:col-span-7 ">
        <div className="flex flex-col items-start gap-5">
          <h1 className="text-3xl  font-bold text-black ">{t("Courses")}</h1>
          <GridContainer cols={3}>
            {courses.length > 0 ? (
              <>
                {courses.map((product: any, i: number) => (
                  <ProductCard registerNow={true} index={i} key={product.id} product={product} />
                ))}
              </>
            ) : (
              <Empty message={t("empty")} />
            )}
            <PaginationDemo totalPages={totalPages} />
          </GridContainer>
        </div>
      </section>
    </Suspense>
  );
};

export default ProductReelFetch;
