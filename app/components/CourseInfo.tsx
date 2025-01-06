"use client";

import { Button } from "@/components/ui/button";
import { differenceInDays, differenceInWeeks, differenceInMonths, format } from "date-fns";
import { CalendarIcon, Timer } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import ModalCustom from "./defaults/ModalCustom";
import ApplicantForm from "./forms/ApplicantForm";
import ExportToPdf from "./ExportToPdf";
import NoSSR from "./NoSSr";

export default function CourseInfo({
  course,
}: {
  course: { startDate: string; endDate: string; price: number; _id: string };
}) {
  console.log(course);
  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);

  // Calculate duration
  const days = differenceInDays(endDate, startDate);
  const weeks = differenceInWeeks(endDate, startDate);
  const months = differenceInMonths(endDate, startDate);

  // Format duration
  let formattedDuration = "";
  if (months > 0) {
    formattedDuration = `${months} شهر${months > 1 ? "s" : ""}`;
  } else if (weeks > 0) {
    formattedDuration = `${weeks} أسبوع${weeks > 1 ? "s" : ""}`;
  } else {
    formattedDuration = `${days} يوم${days > 1 ? "s" : ""}`;
  }

  return (
    <div className="flex  lg:w-[30%] w-full  sticky mb-auto top-0 left-0 max-w-3xl flex-col font-medium">
      <h1 className="rounded-t-xl text-white px-4 py-2 bg-main">معلومات عن الدورة</h1>
      <div className="bg-white rounded-b-xl">
        <div className="flex px-4 py-1 gap-2 items-center justify-between">
          <div className="flex items-center gap-1">
            <p>التاريخ:</p>
            <CalendarIcon className=" w-4 h-4" />
          </div>
          <p className="text-muted-foreground">{format(startDate, "yyyy-MM-dd")}</p>
        </div>
        <div className="flex px-4 py-1 gap-2 items-center justify-between">
          <div className="flex items-center gap-1">
            <p>المدة :</p>
            <Timer className=" w-4 h-4" />
          </div>
          <p className="text-muted-foreground">{formattedDuration}</p>
        </div>
        <div className="flex px-4 py-1 gap-2 items-center justify-between">
          <div className="flex items-center gap-1">
            <p>الرسوم :</p>
            <FaMoneyBill className=" w-4 h-4" />
          </div>
          <p className="text-muted-foreground">{course.price}$</p>
        </div>

        <div className="flex px-4 py-1 gap-2 flex-col">
          <ModalCustom
            btn={
              <Button className="text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            }
            content={<ApplicantForm course={course._id} />}
          />
          <Button className="text-gray-50 bg-main hover:bg-main/50 duration-150" size={"sm"}>
            ابق علي تواصل
          </Button>

          <NoSSR>
            <ExportToPdf
              btn={
                <Button className="text-gray-50 bg-red-500 hover:bg-red-400 duration-150" size={"sm"}>
                  تنزيل النشرة
                </Button>
              }
              course={course}
            />
          </NoSSR>
        </div>
      </div>
    </div>
  );
}
