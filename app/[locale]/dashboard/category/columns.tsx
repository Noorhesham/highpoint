"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CategoryProps } from "@/app/models/Category";
import Actions from "@/app/components/dashboard/Actions";
import LocaleData from "@/app/components/LocaleData";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { SheetData } from "@/app/components/Sheet";

export const columns: ColumnDef<CategoryProps>[] = [
  {
    accessorKey: "mainImage",
    header: "",
    cell: ({ row }) => (
      <div className="w-16 rounded-xl overflow-hidden h-16 relative">
        <Image src={row.original.mainImage?.[0]?.secure_url} alt={row.original.name} className=" object-cover" fill />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name ",
    cell: ({ row }) => <LocaleData data={row.original.name} />,
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <LocaleData data={row.original.description} />,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        {row.original.status === "active" ? (
          <CheckCircle className=" w-4 h-4 text-green-400" />
        ) : (
          <ExclamationTriangleIcon className=" w-4 h-4 text-red-400" />
        )}
        {row.original.status === "active" ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "subCategories",
    accessorKey: "subCategories",
    header: "Sub Categories",
    cell: ({ row }) => <SheetData itemParent={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="Category" data={row.original} />,
  },
];
