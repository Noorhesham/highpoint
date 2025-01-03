import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import ModalCustom from "@/app/components/defaults/ModalCustom";

import { DataTable } from "@/app/components/DataTable";
import CategoriesForm from "@/app/components/forms/CategoriesForm";
export const dynamic = "force-dynamic";

const Page = async ({ params: { locale } }: { params: { locale: string } }) => {
  const { data } = await getEntities("Category", 1, "", true);
  console.log(data);
  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <ModalCustom
        btn={<Button className="self-end">Add Category</Button>}
        title="Add Category"
        content={<CategoriesForm />}
      />

      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="Category" />
    </MaxWidthWrapper>
  );
};
export default Page;
