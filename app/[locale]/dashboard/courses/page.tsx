import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";
import { DataTable } from "@/app/components/DataTable";
import ExportCoursesToPDF from "@/app/components/ExportAll";
import Link from "next/link";
export const dynamic = "force-dynamic";

const Page = async () => {
  const { data } = await getEntities("Course", 1, {}, true, "category");
  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        <Button className="self-end">
          <Link href={"/dashboard/createCourse"}>Add Course</Link>
        </Button>
        {data?.data && <ExportCoursesToPDF courses={data.data} />}
      </div>
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="Course" />
    </MaxWidthWrapper>
  );
};
export default Page;
