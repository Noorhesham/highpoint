import { getEntities } from "@/app/actions/actions";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import HomePageForm from "@/app/components/forms/HomePageForm";
import React from "react";

const page = async () => {
  const page = await getEntities("HomePage", 1, {});
  return (
    <MaxWidthWrapper>
      <HomePageForm page={page.data?.data[0]} />
    </MaxWidthWrapper>
  );
};

export default page;
