"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ModalCustom from "./defaults/ModalCustom";
import ApplicantForm from "./forms/ApplicantForm";
import { useTranslations } from "next-intl";

interface CourseCardProps {
  title: string;
  date: string;
  language: string;
  format: string;
  location: string;
  venue: string;
  imageSrc: string;
}

export default function CourseCard({ title, date, language, format, location, venue, imageSrc }: CourseCardProps) {
  const t = useTranslations();
  return (
    <Card className="w-[300px] overflow-hidden border-0 shadow-lg">
      <div className="relative h-[180px] bg-[#1a3b5c]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/10 p-6">
            <div className="rounded-full border-2 border-white/50 p-4">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                width={50}
                height={50}
                className="h-10 w-10 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-[#1a3b5c] p-4">
          <h3 className="text-center text-lg font-bold text-white">{title}</h3>
        </div>
      </div>
      <CardContent className="bg-white p-4">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="mt-1 h-4 w-4 min-w-4 rounded-sm bg-[#e67e22]"></div>
            <span className="text-sm">{date}</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-4 w-4 min-w-4 rounded-sm bg-[#e67e22]"></div>
            <span className="text-sm">{language}</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-4 w-4 min-w-4 rounded-sm bg-[#e67e22]"></div>
            <span className="text-sm">{format}</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-4 w-4 min-w-4 rounded-sm bg-[#e67e22]"></div>
            <span className="text-sm">{location}</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="mt-1 h-4 w-4 min-w-4 rounded-sm bg-[#e67e22]"></div>
            <span className="text-sm">{venue}</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="bg-white p-4 pt-0">

      </CardFooter>
    </Card>
  );
}
