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
    accessorKey: "name.en",
    header: "Name (English)",
  },
  {
    accessorKey: "name.ar",
    header: "Name (Arabic)",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price.toFixed(2)}`,
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
    cell: ({ row }) => row.original.category?.name.en || "Uncategorized", // Assuming `category` is populated
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="Course" data={row.original} />,
  },
  {
    id: "export-nodates",
    accessorKey: "Download Pdf",
    cell: ({ row }) => (
      <NoSSR>
        <ExportToPDF course={row.original} />
      </NoSSR>
    ),
  },
];
