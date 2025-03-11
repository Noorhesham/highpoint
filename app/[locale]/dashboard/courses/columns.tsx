"use client";

import Actions from "@/app/components/dashboard/Actions";
import dynamic from "next/dynamic";
const PDFDownload = dynamic(() => import("@/app/components/ExportToPdf"), { ssr: false });
import { CourseProps } from "@/app/models/Course";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import CoursePage from "@/app/components/ExportToPdf";
import ExportToPDF from "@/app/components/ExportToPdf";
import NoSSR from "@/app/components/NoSSr";
import ExportCoursesToPDF from "@/app/components/ExportCourseToPDf";
import ExportToPdf from "@/app/components/ExportToPdf";
import Link from "next/link";
import { PenIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { ExportPdfModal } from "@/app/components/ExportPdfModel";
export const columns: ColumnDef<CourseProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: "Name",
    accessorFn: (row) => `${row.name.en} ${row.name.ar}`,
    // Optional: Use a default filter that checks for substring matching.
    filterFn: (row, columnId, filterValue) => {
      const cellValue = row.getValue(columnId);
      return cellValue.toLowerCase().includes(filterValue.toLowerCase());
    },
    cell: ({ row }) => {
      // Customize your display if needed.
      const { en, ar } = row.original.name;
      return (
        <>
          <div>{en}</div>
          <div>{ar}</div>
        </>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original?.price?.toFixed(2) || ""}`,
  },
  {
    accessorKey: "duration",
    header: "Duration (days)",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category?.name?.en || "Uncategorized", // Assuming `category` is populated
  },
  {
    id: "export-pdf",
    accessorKey: "Pdf Export",
    cell: ({ row }) => {
      return (
        <NoSSR>
          <ExportPdfModal course={row.original} />
        </NoSSR>
      );
    },
  },
];
