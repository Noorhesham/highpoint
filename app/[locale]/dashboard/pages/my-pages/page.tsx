import { deleteEntity, getEntities } from "@/app/actions/actions";
import { DataTable } from "@/app/components/DataTable";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { PaginationDemo } from "@/app/components/Pagination";
import Link from "next/link";
import React from "react";
import { columns } from "./columns";

const page = async ({ searchParams: { page } }: { searchParams: { page: string } }) => {
  const pages = await getEntities("Page", +page || 1, {});
  console.log(pages.data);
  return (
    <MaxWidthWrapper className=" w-full">
      <h1>Pages</h1>
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={pages?.data?.data} entity="Page" />

      {pages.data.totalPages > 1 && <PaginationDemo totalPages={pages.data.totalPages} />}
    </MaxWidthWrapper>
  );
};

export default page;
