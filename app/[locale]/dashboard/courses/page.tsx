import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import ModalCustom from "@/app/components/defaults/ModalCustom";
import { DataTable } from "@/app/components/DataTable";
import CoursesForm from "@/app/components/forms/CoursesForm";

const Page = async ({ params: { locale } }: { params: { locale: string } }) => {
  const { data } = await getEntities("Course", 1, "", true, "category");
  console.log(data);
  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <ModalCustom
        btn={<Button className="self-end">Add Course</Button>}
        title="Add Course"
        content={<CoursesForm />}
      />
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="Course" />
    </MaxWidthWrapper>
  );
};
export default Page;
