import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import ModalCustom from "@/app/components/defaults/ModalCustom";

import { DataTable } from "@/app/components/DataTable";
import CityForm from "@/app/components/forms/CityForm";
export const dynamic = "force-dynamic";

const Page = async () => {
  const { data } = await getEntities("City", 1, {}, true);
  console.log(data);
  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <ModalCustom btn={<Button className="self-end">Add City</Button>} title="Add City" content={<CityForm />} />
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="City" />
    </MaxWidthWrapper>
  );
};
export default Page;
