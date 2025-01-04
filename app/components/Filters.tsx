"use client";
import React, { ReactNode } from "react";
import Box from "./Box";
import { useLocale } from "next-intl";
interface FilterOption {
  id: string | number;
  name?: string;
  label?: string;
  title?: string;
}
const Filters = ({ colseBtn, filters, from_years }: { colseBtn?: ReactNode; filters: any[]; from_years?: any }) => {
  const [del, setDelete] = React.useState(false);
  console.log(del);
  const locale = useLocale();
  const renderFilterBoxes = () => {
    console.log(filters);
    return filters?.map((filterObj, index) => {
      const entries: [string, FilterOption[]][] = Object.entries(filterObj);

      const [label, filterOptions]: [string, FilterOption[]] = entries[0];
      // this will be an entryarray (key value pair) cause i need the first as label and second optios
      const filterKey = filterObj.filter;
      const arr = filterObj.arr || false;

      if (!filterOptions || filterOptions.length === 0) return null;
      return (
        <Box
          setDelete={setDelete}
          btn={!arr}
          key={index}
          filter={filterKey}
          text={label}
          options={filterOptions.map((filter: any) => ({
            id: filter._id || filter.value,
            name: filter.title || filter.name[locale] || filter.label,
          }))}
        />
      );
    });
  };

  return (
    <div className="max-h-screen rounded-2xl border bg-white shadow-sm border-gray-400 overflow-y-auto lg:max-h-full col-span-full">
      <div className="flex flex-col py-4 px-3">
        {colseBtn}
        {renderFilterBoxes()}
      </div>
    </div>
  );
};

export default Filters;
