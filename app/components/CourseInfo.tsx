"use client";

import { Button } from "@/components/ui/button";
import { differenceInDays, differenceInWeeks, differenceInMonths, format } from "date-fns";
import { CalendarIcon, Timer } from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import ModalCustom from "./defaults/ModalCustom";
import ApplicantForm from "./forms/ApplicantForm";
import ExportToPdf from "./ExportToPdf";
import NoSSR from "./NoSSr";
import { useLocale, useTranslations } from "next-intl";
import { CourseProps } from "../models/Course";
import { OperationProps } from "../models/Operations";

export default function CourseInfo({
  course,
  operation,
  operations,
  courseId,
}: {
  course: CourseProps;
  operation: any;
  operations?: OperationProps[];
  courseId?: string;
}) {
  const startDate = new Date(course.startDate);
  const endDate = new Date(course.endDate);
  const locale = useLocale();
  const days = differenceInDays(endDate, startDate);
  const weeks = differenceInWeeks(endDate, startDate);
  const months = differenceInMonths(endDate, startDate);
  const t = useTranslations();

  let formattedDuration = "";
  if (months > 0) {
    formattedDuration = `${months} ${t("months")}${months > 1 ? t("pluralSuffix") : ""}`;
  } else if (weeks > 0) {
    formattedDuration = `${weeks} ${t("weeks")}${weeks > 1 ? t("pluralSuffix") : ""}`;
  } else {
    formattedDuration = `${days} ${t("days")}${days > 1 ? t("pluralSuffix") : ""}`;
  }

  return operation ? (
    <div className=" flex items-center justify-between py-2 ">
      <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
        <div className=" flex text-base items-center gap-2">
          <p>{t("date")}:</p>
          <CalendarIcon className=" w-4 h-4" />
        </div>
        <div className=" flex items-center gap-1">
          <p className="text-muted-foreground">{format(startDate, "yyyy-MM-dd")}</p>
          <p className="text-muted-foreground">{format(endDate, "yyyy-MM-dd")}</p>
        </div>
      </div>
      <h2 className=" font-medium text-base">{course.city.name[locale]}</h2>{" "}
      <ModalCustom
        btn={
          <Button className="text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
            {t("registerNow")}
          </Button>
        }
        content={<ApplicantForm operations={operations} operation={operation._id} course={courseId} />}
      />
    </div>
  ) : (
    <div className="bg-white border-b border-input py-2 rounded-b-xl">
      <div className="flex px-4 py-1 gap-2 items-center justify-between">
        <div className="flex items-center gap-1">
          <p>{t("date")}:</p>
          <CalendarIcon className=" w-4 h-4" />
        </div>
        <p className="text-muted-foreground">{format(startDate, "yyyy-MM-dd")}</p>
      </div>
      <div className="flex px-4 py-1 gap-2 items-center justify-between">
        <div className="flex items-center gap-1">
          <p>{t("duration")}:</p>
          <Timer className=" w-4 h-4" />
        </div>
        <p className="text-muted-foreground">{formattedDuration}</p>
      </div>
      <div className="flex px-4 py-1 gap-2 items-center justify-between">
        <div className="flex items-center gap-1">
          <p>{t("fees")}:</p>
          <FaMoneyBill className=" w-4 h-4" />
        </div>
        <p className="text-muted-foreground">{course.price}$</p>
      </div>

      <div className="flex px-4 py-1 gap-2 mr-auto">
        <ModalCustom
          btn={
            <Button className="text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
              {t("registerNow")}
            </Button>
          }
          content={<ApplicantForm course={courseId} operations={operations} />}
        />
        <Button className="text-gray-50 bg-main hover:bg-main/50 duration-150" size={"sm"}>
          {t("stayConnected")}
        </Button>

        {!operation && (
          <NoSSR>
            <ExportToPdf
              btn={
                <Button className="text-gray-50 bg-red-500 hover:bg-red-400 duration-150" size={"sm"}>
                  {t("downloadBrochure")}
                </Button>
              }
              course={course}
            />
          </NoSSR>
        )}
      </div>
    </div>
  );
}
