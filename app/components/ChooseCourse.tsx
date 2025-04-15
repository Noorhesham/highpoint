"use client";

import React from "react";
import { useGetEntity } from "../queries";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SelectCustom from "./Select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

const ChooseCourse = () => {
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
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

  const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  const resetFilters = () => {
    setSelectedCity("");
    setSelectedCategory("");
    setSelectedDate(null);
  };

  return (
    <div className="py-4 px-4 sm:px-6 md:px-8 flex flex-col gap-4">
      {/* Filters Container */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* City Filter */}
        <div className="w-full md:w-1/3">
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
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-1/3">
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
        </div>

        {/* Date Picker */}
        <div className="w-full md:w-1/3">
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full pl-3 flex justify-between text-left rounded-lg font-normal h-10"
              >
                {formattedDate ? formattedDate : <span>{t("SELECT_DATE")}</span>}
                <CalendarIcon className="ml-auto mr-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              onClick={(e) => e.stopPropagation()}
              sideOffset={-40}
              className="w-full z-[51] relative p-0"
              align="center"
              alignOffset={0}
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button className="w-full sm:w-auto" disabled={!selectedCity && !selectedCategory && !formattedDate}>
          <Link
            className="w-full flex justify-center"
            href={`/courses?city=${selectedCity}&category=${selectedCategory}&startDate=${formattedDate}`}
          >
            {t("search")}
          </Link>
        </Button>
        <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
          {t("reset")}
        </Button>
      </div>
    </div>
  );
};

export default ChooseCourse;
