import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import { Button } from "@/components/ui/button";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

import FlexWrapper from "@/app/components/defaults/FlexWrapper";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import Course, { CourseProps } from "@/app/models/Course";
import styles from "./course.module.css";
import "@/app/models";

import CourseInfo from "@/app/components/CourseInfo";
import Empty from "@/app/components/Empty";
import Tabing from "@/app/components/Tabing";
import Image from "next/image";
import ProductCard from "@/app/components/Product";
import Head from "@/app/components/Head";
import connect from "@/lib/clientPromise";
import GridContainer from "@/app/components/defaults/GridContainer";
import { getDayOrdinal } from "@/app/utils/fn";

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
    <section className={styles.course}>
      <div className=" text-white py-8 md:py-12">
        <MaxWidthWrapper className="!pt-32">
          <div
            className={` ${locale === "ar" ? "flex-row-reverse" : ""}  gap-6  flex   bg-[#264bad] 
           mx-auto  justify-between items-start lg:flex-row flex-col  px-4 w-full `}
          >
            <div className=" relative h-44 mt-5  w-full lg:w-44 ml-4 lg:left-20 mb-5 rounded-2xl overflow-hidden">
              <Image alt={name.en} src={images?.[0].secure_url} fill className=" object-cover" />
            </div>
            <div className=" mt-10">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{name?.[locale] || ""}</h1>
                <Paragraph
                  className="text-sm md:text-base text-white/90 space-y-2"
                  description={course.shortDescription?.[locale] || ""}
                />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>{" "}
      </div>
      <div className=" relative">
        <MaxWidthWrapper>
          <Tabing
            defaultValue="info"
            options={[
              {
                label: t("general look"),
                content: course.description?.[locale] ? (
                  <Paragraph full description={course.description[locale]} />
                ) : (
                  <Paragraph full description={t("noDescriptionAvailable")} />
                ),
                href: "info",
                icon: "overview",
              },
              {
                label: t("courseContent"),
                icon: "outline",

                content: course.courseContent?.[locale] ? (
                  <div className=" w-full">
                    <Paragraph
                      full
                      className="!max-w-full border-b-main border-b  text-sm pb-5 grid grid-cols-1  gap-4 lg:max-w-full"
                      description={course.courseContent[locale]}
                    />
                    {Array.isArray(days) && days.length > 0 ? (
                      <GridContainer className=" mt-4" cols={2}>
                        {days.map((day: any, i: number) => (
                          <div key={i} className="flex border-input bg-gray-50 flex-col gap-1 ">
                            <Head
                              className=" py-2 px-4 bg-main/80 !text-white rounded-t-2xl !text-lg"
                              text={getDayOrdinal(i, locale)}
                            />
                            <Paragraph
                              className="!max-w-full grid grid-cols-1  gap-2 lg:max-w-full"
                              description={day?.[locale] || t("noContentForDay")}
                            />
                          </div>
                        ))}
                      </GridContainer>
                    ) : (
                      <Paragraph description={t("noDaysAvailable")} />
                    )}
                  </div>
                ) : (
                  <Paragraph description={t("noCourseContentAvailable")} />
                ),
                href: "content",
              },

              {
                label: t("timeTable"),
                icon: "schedule",

                content:
                  Array.isArray(operations) && operations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {operations.map((operation: any, i: number) => (
                        <CourseInfo operation course={operation} courseId={_id} key={i} />
                      ))}
                    </div>
                  ) : (
                    <Paragraph description={t("noOperationsAvailable")} />
                  ),
                href: "timeTable",
              },
              {
                label: t("certificate"),
                icon: "npc",

                content:
                  course.certificate?.image?.secure_url && course.certificate?.name?.[locale] ? (
                    <div className="flex items-center gap-3">
                      <div className="w-full  h-40 relative">
                        <Image
                          src={course.certificate.image.secure_url}
                          alt={course.certificate.name[locale]}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <Head className=" !max-w-2xl !text-lg" text={course.name[locale]} />
                      </div>
                    </div>
                  ) : (
                    <Paragraph description={t("noCertificateAvailable")} />
                  ),
                href: "certificate",
              },
            ]}
          />
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <div className="flex items-start flex-col gap-5 my-3">
          <Head text={t("otherCourses")} />
          <div className=" grid w-full  grid-cols-1 md:grid-cols-4 gap-4">
            {similarCourses?.map((course: any, i: number) => (
              <ProductCard index={i} key={course.id} product={course} />
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
