import React, { Suspense } from "react";
import { unstable_cache } from "next/cache";
import ProductCard from "./Product";
import GridContainer from "./defaults/GridContainer";
import { PaginationDemo } from "./Pagination";
import Empty from "./Empty";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { getEntities } from "../actions/actions";

const fetchProducts = async (page: number) => {
  return await getEntities("Course", page, {}, false, "category");
};

// Wrapping the cache around the fetch function
const cachedFetchProducts = (page: number, filter: any, locale: string) =>
  unstable_cache(() => fetchProducts(page), [`Course-${page}`], {
    revalidate: 60,
    tags: [`Course-${page}`],
  });
const ProductReelFetch = async ({
  page = 1,
  filter = {},
  locale = "en",
}: {
  page: number;
  filter: any;
  locale?: string;
}) => {
  // Use the cached function to fetch products with the specific page and filter,
  const res = await cachedFetchProducts(page, filter, locale)();
  console.log(res);
  if (!res || !res.data) {
    return null; // Handle the case where the response is invalid or empty
  }

  const { data, totalPages } = res.data;
  const courses = data;

  return (
    <Suspense>
      {" "}
      <section className=" pt-32">
        <MaxWidthWrapper className="flex flex-col items-center gap-5">
          <h1 className="text-6xl  font-bold text-black ">Courses</h1>
          <GridContainer cols={3}>
            {courses.length > 0 ? (
              <>
                {courses.map((product: any, i: number) => (
                  <ProductCard index={i} key={product.id} product={product} />
                ))}
              </>
            ) : (
              <Empty />
            )}
            <PaginationDemo totalPages={totalPages} />
          </GridContainer>
        </MaxWidthWrapper>
      </section>
    </Suspense>
  );
};

export default ProductReelFetch;
