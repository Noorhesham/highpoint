import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import ModalCustom from "@/app/components/defaults/ModalCustom";
import { DataTable } from "@/app/components/DataTable";
import UserForm from "./UserForm";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { data } = await getEntities("User", 1, {}, true);

  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <ModalCustom btn={<Button className="self-end">Add User</Button>} title="Add User" content={<UserForm />} />
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="User" />
    </MaxWidthWrapper>
  );
};

export default Page;
