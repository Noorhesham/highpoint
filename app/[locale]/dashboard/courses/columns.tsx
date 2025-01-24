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
    accessorKey: "Pdf With City",
    cell: ({ row }) => (
      <NoSSR>
        <ExportToPdf type="withoutCity" course={row.original} />
      </NoSSR>
    ),
  },
  {
    id: "export-nodates",
    accessorKey: "Pdf Without Price",
    cell: ({ row }) => (
      <NoSSR>
        <ExportToPdf type="withoutPrice" course={row.original} />
      </NoSSR>
    ),
  },
  {
    id: "export-nodates",
    accessorKey: "Pdf All",
    cell: ({ row }) => (
      <NoSSR>
        <ExportToPdf type="all" course={row.original} />
      </NoSSR>
    ),
  },
];
