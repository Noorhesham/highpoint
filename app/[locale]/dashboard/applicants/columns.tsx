"use client";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/app/components/dashboard/Actions";
import LocaleData from "@/app/components/LocaleData";

export interface ApplicantProps {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course?: { name: string };
  createdAt: string;
  status: "approved" | "pending" | "rejected";
}

export const columns: ColumnDef<ApplicantProps>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => <span>{row.original.firstName + " " + row.original.lastName}</span>,
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
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
    // Custom sorting function based on date
  },
  {
    accessorKey: "course",
    header: "Course",
    cell: ({ row }) => <LocaleData data={row.original.course?.name} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="Applicant" data={row.original} />,
  },
];
