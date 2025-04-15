import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { deleteEntity } from "@/app/actions/actions";
import { DataTable } from "@/app/components/DataTable";
import ExportCoursesToPDF from "@/app/components/ExportAll";
import Link from "next/link";
import NoSSR from "@/app/components/NoSSr";
import connect from "@/lib/clientPromise";
import Course from "@/app/models/Course";
import SearchCourses from "./SearchCourses";

export const dynamic = "force-dynamic";

const Page = async ({ searchParams, locale }: { searchParams: { page?: string }; locale: string }) => {
  await connect();
  const searchTerm = searchParams.search || "";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const limit = 10;

  // Fetch paginated data
  const data = await Course.find({
    $or: [{ "name.en": { $regex: searchTerm, $options: "i" } }, { "name.ar": { $regex: searchTerm, $options: "i" } }],
  })
    .limit(limit)
    .skip((currentPage - 1) * limit)
    .populate("category")
    .populate("city")
    .populate({
      path: "operations",
      populate: {
        path: "city",
        select: "name", // Assuming 'name' is the field for the city.
      },
    })
    .lean();

  const totalCount = (await Course.countDocuments({}).lean()) as number;
  const totalPages = Math.ceil(totalCount / limit);
  return (
    <MaxWidthWrapper className="flex px-4 flex-col mt-5">
      <div className="flex items-center gap-2">
        {" "}
        <SearchCourses />
        <Button className="self-end">
          <Link href="/dashboard/createCourse">Add Course</Link>
        </Button>
        {data && (
          <div className="flex gap-2 mr-auto">
            <NoSSR>
              <ExportCoursesToPDF isArabic={false} courses={data} />
            </NoSSR>
            <NoSSR>
              <ExportCoursesToPDF isArabic={true} courses={data} />
            </NoSSR>
          </div>
        )}
      </div>
      <DataTable
        handleDeleteAll={deleteEntity}
        columns={columns}
        data={data}
        entity="Course"
        page={currentPage}
        totalPages={totalPages}
      />
    </MaxWidthWrapper>
  );
};

export default Page;
