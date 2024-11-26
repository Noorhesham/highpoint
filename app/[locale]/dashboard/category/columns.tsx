"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CategoryProps } from "@/app/models/Category";
import Actions from "@/app/components/dashboard/Actions";
import LocaleData from "@/app/components/LocaleData";
import Image from "next/image";

export const columns: ColumnDef<CategoryProps>[] = [
  {
    accessorKey: "mainImage",
    header: "",
    cell: ({ row }) => (
      <div className="w-16 h-16 relative">
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
      <span
        style={{
          color: row.original.status === "active" ? "green" : "red",
        }}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="Category" data={row.original} />,
  },
];
