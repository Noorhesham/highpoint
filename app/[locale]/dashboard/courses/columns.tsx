"use client";

import Actions from "@/app/components/dashboard/Actions";
import ExportToPDF from "@/app/components/ExportToPdf";
import { CourseProps } from "@/app/models/Course";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

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
    cell: ({ row }) => <ExportToPDF item={row.original} />,
  },
];
