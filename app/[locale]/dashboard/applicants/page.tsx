import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity, getEntities } from "@/app/actions/actions";

import { DataTable } from "@/app/components/DataTable";
import ExportApplicantsToPdf from "./PdfApplicants";
import NoSSR from "@/app/components/NoSSr";
export const dynamic = "force-dynamic";

const Page = async ({ params: { locale } }: { params: { locale: string } }) => {
  const { data } = await getEntities("Applicant", 1, {}, true, "course");
  console.log(data);
  return (
    <MaxWidthWrapper noPadding className="flex flex-col mt-5">
      <NoSSR>
        <ExportApplicantsToPdf applicants={data?.data} />
      </NoSSR>
      <DataTable handleDeleteAll={deleteEntity} columns={columns} data={data?.data} entity="Applicant" />
    </MaxWidthWrapper>
  );
};
export default Page;
