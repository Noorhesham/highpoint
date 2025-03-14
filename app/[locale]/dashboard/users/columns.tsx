"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/models/User";
import Actions from "@/app/components/dashboard/Actions";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="User" data={row.original} />,
  },
];
