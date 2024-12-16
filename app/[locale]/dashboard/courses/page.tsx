import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import ModalCustom from "@/app/components/defaults/ModalCustom";
import { DataTable } from "@/app/components/DataTable";
import CoursesForm from "@/app/components/forms/CoursesForm";
import ExportCoursesToPDF from "@/app/components/ExportAll";

const Page = async () => {
  const { data } = await getEntities("Course", 1, "", true, "category");
  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <div className="flex items-center gap-2">
        <ModalCustom
          btn={<Button className="self-end">Add Course</Button>}
          title="Add Course"
          content={<CoursesForm />}
        />
        {data?.data && <ExportCoursesToPDF courses={data.data} />}
      </div>
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="Course" />
    </MaxWidthWrapper>
  );
};
export default Page;
