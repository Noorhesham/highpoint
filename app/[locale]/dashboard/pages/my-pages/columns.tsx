"use client";

import Actions from "@/app/components/dashboard/Actions";
import dynamic from "next/dynamic";
const PDFDownload = dynamic(() => import("@/app/components/ExportToPdf"), { ssr: false });
import { CourseProps } from "@/app/models/Course";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import CoursePage from "@/app/components/ExportToPdf";
import ExportToPDF from "@/app/components/ExportToPdf";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";

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
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "slug",
    header: "slug",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button>
        <Link className="flex items-center gap-3" href={`/dashboard/pages/editPage/${row.original._id}`}>
          Open <LinkIcon />
        </Link>
      </Button>
    ),
  },
];
