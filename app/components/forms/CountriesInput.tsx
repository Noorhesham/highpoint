"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import FlexWrapper from "../defaults/FlexWrapper";
import { useGetEntity } from "@/app/queries";
import ComboboxForm from "./ComboboxForm";
import { MultiSelect } from "./MultiSelect";

const CategoriesInput = ({
  categoryName,
  subCategory,
  cityName,
}: {
  categoryName: string;
  subCategory: string;
  cityName?: string;
}) => {
  const form = useFormContext();
  const t = useTranslations("category");
  const { data: categories, isLoading: isCategoriesLoading } = useGetEntity({
    entityName: "Category",
    key: "categories",
  });
  const locale = useLocale();
  const selectedCategory = form.getValues("category");

  const { data: subCategories, isLoading: isSubCategoriesLoading } = useGetEntity({
    entityName: "SubCategory",
    filter: { parentCategory: selectedCategory },
    key: `subCategories-${selectedCategory || ""}`,
  });
  console.log(categories);
  return (
    <FlexWrapper max={false} className="flex  w-full gap-4">
      {
        <ComboboxForm
          onChange={() => form.setValue(subCategory, [])}
          loading={isCategoriesLoading}
          disabled={isCategoriesLoading}
          name={categoryName}
          label={t("title")}
          placeholder={t("select")}
          options={categories?.data?.data.map((category: any) => ({
            label: category.name[locale],
            value: category._id,
          }))}
        />
      }
      {selectedCategory && !isSubCategoriesLoading && (
        <MultiSelect 
          defaultValue={form.getValues(subCategory) || []}
          name={subCategory}
          onValueChange={(val) => form.setValue(subCategory, val)}
          options={subCategories?.data?.data.map((subCategory: any) => ({
            label: subCategory.name[locale],
            value: subCategory._id,
          }))}
        />
      )}
    </FlexWrapper>
  );
};

export default CategoriesInput;
