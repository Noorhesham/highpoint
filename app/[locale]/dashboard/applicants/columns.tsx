"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Actions from "@/app/components/dashboard/Actions"; // Replace with your actual Actions component
import LocaleData from "@/app/components/LocaleData";

export interface ApplicantProps {
  profileImage?: string;
  name: string;
  email: string;
  status: "approved" | "pending" | "rejected";
}

export const columns: ColumnDef<ApplicantProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.original.fullName}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.original.phone}</span>,
  },
  {
    accessorKey: "name",
    header: "Name ",
    cell: ({ row }) => <LocaleData data={row.original.course?.name} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="Applicant" data={row.original} />,
  },
];
