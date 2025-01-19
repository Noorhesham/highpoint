import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import { Button } from "@/components/ui/button";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

import FlexWrapper from "@/app/components/defaults/FlexWrapper";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import Course, { CourseProps } from "@/app/models/Course";
import Operation, { OperationProps } from "@/app/models/Operations";
 
import CourseInfo from "@/app/components/CourseInfo";
import Empty from "@/app/components/Empty";
import Tabing from "@/app/components/Tabing";
import Image from "next/image";
import ProductCard from "@/app/components/Product";
import Head from "@/app/components/Head";
import connect from "@/lib/clientPromise";

const page = async ({ params: { locale, id } }: { params: { locale: string; id: string } }) => {
  await connect();
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
  const similarCourses = await Course.find({ category: course.category }).limit(5).lean();
  console.log(course);
  return (
    <section className="">
      <HomeCover
        className=" w-full "
        image={images[0]?.secure_url || "/default.jpg"}
        mainTitle={name[locale]}
        mainDesc={course.shortDescription[locale]}
      />
      <div className=" relative">
        <MaxWidthWrapper>
          <Tabing
            options={[
              {
                label: t("general look"),
                content: <Paragraph description={course.description[locale]} />,
                href: "info",
              },
              {
                label: t("courseContent"),
                content: (
                  <div>
                    <Paragraph
                      className="!max-w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-w-full"
                      description={course.courseContent[locale]}
                    />
                    {days?.map((day: any, i: number) => (
                      <div key={i} className=" flex flex-col gap-1 mt-5">
                        <Head text={t("day") + " " + (i + 1)} />
                        <Paragraph
                          className="!max-w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-w-full"
                          description={day?.[locale]}
                        />
                      </div>
                    ))}
                  </div>
                ),
                href: "content",
              },
              {
                label: t("certificate"),
                content: (
                  <div className="flex items-center gap-3">
                    <div className=" w-40  p-5 h-40  relative">
                      <Image
                        src={course.certificate.image.secure_url}
                        alt={course.certificate.name[locale]}
                        fill
                        className=" object-contain"
                      />
                    </div>
                    <div>
                      <Head text={course.certificate.name[locale]} />
                      <Paragraph
                        className="!max-w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:max-w-full"
                        description={course.certificate?.description?.[locale || ""] || ""}
                      />
                    </div>
                  </div>
                ),
                href: "certificate",
              },
              {
                label: t("timeTable"),
                content: (
                  <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                    {operations?.map((operation: any, i: Number) => (
                      <CourseInfo operation course={operation} courseId={_id} />
                    ))}
                  </div>
                ),
                href: "timeTable",
              },
            ]}
          />
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <div className="flex items-start flex-col gap-5 my-3">
          <Head text={t("otherCourses")} />
          <div className=" grid w-full  grid-cols-1 md:grid-cols-4 gap-4">
            {similarCourses.map((course: any, i: number) => (
              <ProductCard index={i} key={course.id} product={course} />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
