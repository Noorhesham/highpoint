"use client";

import Actions from "@/app/components/dashboard/Actions";
import { OperationProps } from "@/app/models/Operations";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<OperationProps>[] = [
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => new Date(row.original.startDate).toLocaleDateString(),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => row.original.city.name,
  },
  {
    accessorKey: "duration",
    header: "Duration (days)",
  },
  {
    accessorKey: "sale",
    header: "Sale",
    cell: ({ row }) => `$${row.original.sale.toFixed(2)}`,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];
