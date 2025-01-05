"use client";
import React from "react";
import { useGetEntity } from "../queries";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SelectCustom from "./Select";
const ChooseCourse = () => {
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const locale = useLocale();
  const { data: cities, isLoading } = useGetEntity({
    entityName: "City",
    key: "city",
  });
  const { data: categories, isLoading: isLoadingCategories } = useGetEntity({
    entityName: "Category",
    key: "category",
  });
  return (
    <div className=" py-4 px-8 flex flex-col gap-4">
      <h2>لم تصل لقرار حول ما يناسبك من الدورات؟</h2>
      <SelectCustom
        onChange={setSelectedCity}
        disabled={isLoading || !cities}
        locale={locale}
        options={
          !isLoading && cities ? cities?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] })) : []
        }
        name="city"
        label="City"
        placeholder="Select City"
      />
      <SelectCustom
        onChange={setSelectedCategory}
        disabled={isLoadingCategories || !categories}
        locale={locale}
        options={
          !isLoadingCategories && categories
            ? categories?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] }))
            : []
        }
        name="category"
        label="Category"
        placeholder="Select Category"
      />
      <div className="flex items-center gap-4">
        <Button disabled={!selectedCity || !selectedCategory}>
          <Link href={`/courses?city=${selectedCity}&category=${selectedCategory}`}>ابحث</Link>{" "}
        </Button>
        <Button variant={"outline"}>اعادة التعيين</Button>
      </div>
    </div>
  );
};

export default ChooseCourse;
