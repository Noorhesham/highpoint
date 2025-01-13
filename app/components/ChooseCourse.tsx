"use client";
import React from "react";
import { useGetEntity } from "../queries";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SelectCustom from "./Select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ChooseCourse = () => {
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null); // Store the date as a Date object
  const locale = useLocale();
  const t = useTranslations();
  const { data: cities, isLoading } = useGetEntity({
    entityName: "City",
    key: "city",
  });

  const { data: categories, isLoading: isLoadingCategories } = useGetEntity({
    entityName: "Category",
    key: "category",
  });

  const formattedDate = selectedDate
    ? selectedDate.toISOString().split("T")[0] // Convert to ISO format (yyyy-MM-dd)
    : "";

  const resetFilters = () => {
    setSelectedCity("");
    setSelectedCategory("");
    setSelectedDate(null);
  };
  return (
    <div className="py-4 px-8 flex gap-4">
      {/* City Filter */}
      <SelectCustom
        onChange={setSelectedCity}
        disabled={isLoading || !cities}
        locale={locale}
        options={
          !isLoading && cities
            ? cities?.data?.data.map((p: any) => ({
                value: p._id,
                name: p.name[locale],
              }))
            : []
        }
        name="city"
        label="City"
        placeholder={t("selectCity")}
      />

      {/* Category Filter */}
      <SelectCustom
        onChange={setSelectedCategory}
        disabled={isLoadingCategories || !categories}
        locale={locale}
        options={
          !isLoadingCategories && categories
            ? categories?.data?.data.map((p: any) => ({
                value: p._id,
                name: p.name[locale],
              }))
            : []
        }
        name="category"
        label="Category"
        placeholder={t("Select Category")}
      />

      {/* Date Picker */}
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full pl-3 flex justify-between text-left rounded-lg font-normal">
            {formattedDate ? formattedDate : <span>SELECT</span>}
            <CalendarIcon className="ml-auto mr-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onClick={(e) => e.stopPropagation()} // Prevents the dialog from closing
          sideOffset={-40}
          className="w-full z-[51] relative p-0"
          align="end"
        >
          <Calendar
            selected={selectedDate || new Date()}
            className="relative w-full"
            mode="single"
            captionLayout="dropdown-buttons"
            fromYear={1990}
            toYear={new Date().getFullYear()}
            onSelect={(date) => {
              if (!date) return;
              setSelectedDate(date);
            }}
            disabled={(date) => date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button disabled={!selectedCity && !selectedCategory && !formattedDate}>
          <Link href={`/courses?city=${selectedCity}&category=${selectedCategory}&startDate=${formattedDate}`}>
            ابحث
          </Link>
        </Button>
        <Button variant="outline" onClick={resetFilters}>
          اعادة التعيين
        </Button>
      </div>
    </div>
  );
};

export default ChooseCourse;
