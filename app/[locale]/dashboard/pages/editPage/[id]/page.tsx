import { getEntity } from "@/app/actions/actions";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import PageForm from "@/app/components/forms/PageForm";
import React from "react";

const page = async ({ params: { id } }: { params: { id: string } }) => {
  
  const page = await getEntity("Page", id, "");
  console.log(page)
  return (
    <MaxWidthWrapper>
      <PageForm page={page.data} />
    </MaxWidthWrapper>
  );
};

export default page;
