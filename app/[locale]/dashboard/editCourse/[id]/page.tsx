import { getEntity } from "@/app/actions/actions";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import CoursesForm from "@/app/components/forms/CoursesForm";
import React from "react";
export const revalidate = 0;

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const course = await getEntity("Course", id, "", ["operations"]);
  console.log(course);
  return (
    <MaxWidthWrapper>
      <CoursesForm course={course.data} />
    </MaxWidthWrapper>
  );
};

export default page;
