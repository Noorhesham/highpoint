import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, CodeIcon, Heading1, Laptop, Timer } from "lucide-react";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";
import { FaMoneyBill } from "react-icons/fa";

import FlexWrapper from "@/app/components/defaults/FlexWrapper";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import Course from "@/app/models/Course";
import { format } from "date-fns";
import CourseInfo from "@/app/components/CourseInfo";

const page = async ({ params: { locale, id } }: { params: { locale: string; id: string } }) => {
  unstable_setRequestLocale(locale);
  const coruse = await Course.findById(id)
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
  const { _id, name, description, price, images, createdAt, operations, days } = coruse;
  console.log(coruse);
  return (
    <section className="">
      <HomeCover image={images[0].secure_url} mainTitle={name[locale]} mainDesc={""} />
      <div
        style={{
          backgroundImage: `url(${images[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className=" relative"
      >
        <FlexWrapper className=" mt-5 relative flex items-center justify-between ">
          <div className="w-full max-w-4xl ">
            <div className=" flex w-full  flex-col gap-5">
              <div>
                <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>
                {operations?.map((operation, i) => (
                  <>
                    <div className=" flex items-center justify-between py-2 ">
                      <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                        <div className=" flex text-base items-center gap-2">
                          <p>التاريخ:</p>
                          <CalendarIcon className=" w-4 h-4" />
                        </div>
                        <p className=" text-muted-foreground">{format(new Date(operation.startDate), "yyyy-MM-dd")}</p>
                      </div>
                      <h2 className=" font-medium text-base">{operation.city.name[locale]}</h2>{" "}
                      <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                        سجل الان
                      </Button>
                    </div>
                  </>
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

          <CourseInfo course={coruse} />
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
