import { getEntities } from "@/app/actions/actions";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import ProductCard from "@/app/components/Product";
import { CategoryProps } from "@/app/models/Category";
import React from "react";

const page = async ({ searchParams: { page } }: { searchParams: { page: string } }) => {
  const data = await getEntities("Category", page || 1, {}, true);
  const categories = data.data?.data;
  console.log(categories);
  return (
    <MaxWidthWrapper>
      <GridContainer className=" mt-20 lg:mt-40" cols={4}>
        {categories?.map((category: CategoryProps, i: number) => (
          <ProductCard
            index={i}
            category
            key={category._id}
            product={{
              name: category.name,
              _id: category._id,
              images: category.mainImage,
              description: category.description,
            }}
          />
        ))}
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default page;
