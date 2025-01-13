import { getEntities } from "@/app/actions/actions";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import ProductCard from "@/app/components/Product";
import { CityProps } from "@/app/models/City";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({
  searchParams: { page },
  params: { locale },
}: {
  searchParams: { page: string };
  params: { locale: string };
}) => {
  const data = await getEntities("City", page || 1, {}, true);
  const categories = data.data?.data;
  console.log(categories);
  return (
    <MaxWidthWrapper>
      <GridContainer className=" mt-20 lg:mt-40" cols={4}>
        {categories?.map((category: CityProps, i: number) => (
          <Link key={i} href={`/courses?city=${category._id}`} className=" relative w-full h-40 group">
            <div className=" absolute top-0 left-0 w-full h-full bg-main  opacity-0 group-hover:opacity-80 z-20 duration-200" />
            <div className=" absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <h2 className=" absolute z-30 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">
              {category.name[locale]}
            </h2>
            <Image src={category.image?.secure_url} fill alt="category image" />
          </Link>
        ))}
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default page;
