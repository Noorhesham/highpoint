import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, CodeIcon, Heading1, Laptop, Timer } from "lucide-react";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

import FlexWrapper from "@/app/components/defaults/FlexWrapper";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import Course, { CourseProps } from "@/app/models/Course";
import { format } from "date-fns";
import CourseInfo from "@/app/components/CourseInfo";
import Empty from "@/app/components/Empty";
import ModalCustom from "@/app/components/defaults/ModalCustom";
import ApplicantForm from "@/app/components/forms/ApplicantForm";

const page = async ({ params: { locale, id } }: { params: { locale: string; id: string } }) => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const course = await Course.findById(id)
    .populate({
      path: "operations",
      populate: {
        path: "city",
        model: "City",
      },
    })
    .populate("city")
    .populate("category")
    .lean();
  if (!course) return <Empty link="/courses" />;
  const { _id, name, description, price, images, operations, days } = course as CourseProps;
  console.log(operations);
  return (
    <section className="">
      <HomeCover image={images[0]?.secure_url || "/default.jpg"} mainTitle={name[locale]} mainDesc={""} />
      <div className=" relative">
        <FlexWrapper className=" mt-5 relative flex items-center justify-between ">
          <div className="w-full max-w-6xl lg:w-[70%]  flex-grow">
            <div className=" flex w-full  flex-col gap-5">
              <div>
                <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">{t("timeTable")}</h1>
                {operations?.map((operation: any, i: Number) => (
                  <CourseInfo operation course={operation} courseId={_id} />
                ))}
              </div>
              <Paragraph
                maxWidth
                className=" lg:!max-w-6xl bg-gray-300 py-2 px-4 !text-black"
                description={description[locale]}
              />
              {days?.map((day, i) => (
                <div className=" flex flex-col  gap-2">
                  <h2 className=" text-xl font-bold p-2 text-white bg-main mt-5">{`Day ${i + 1}`}</h2>
                  <Paragraph
                    maxWidth
                    className=" !max-w-6xl  border-input-2 border py-2 px-4 !text-black"
                    description={day[locale]}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex  lg:w-[30%] w-full  sticky mb-auto top-0 left-0 max-w-3xl flex-col font-medium">
            <h1 className="rounded-t-xl text-white px-4 py-2 bg-main">{t("registerNow")}</h1>
            <CourseInfo course={course} courseId={course._id} operations />
          </div>
        </FlexWrapper>
      </div>

      <MaxWidthWrapper>
        <div className=" gap-4 grid md:grid-cols-2 grid-cols-1">
          <div></div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
