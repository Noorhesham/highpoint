"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CityProps } from "@/app/models/City";
import Actions from "@/app/components/dashboard/Actions";

export const columns: ColumnDef<CityProps>[] = [
  {
    accessorKey: "name.en",
    header: "Name (English)",
  },
  {
    accessorKey: "name.ar",
    header: "Name (Arabic)",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "hotelName",
    header: "Hotel Name",
  },
  {
    accessorKey: "hotelLink",
    header: "Hotel Link",
    cell: ({ row }) => (
      <a href={row.original.hotelLink} target="_blank" rel="noopener noreferrer">
        Visit
      </a>
    ),
  },
  {
    accessorKey: "priceForweek",
    header: "Price for 1 Week",
    cell: ({ row }) => `$${row.original.priceForweek.toFixed(2)}`,
  },
  {
    accessorKey: "priceFor2weeks",
    header: "Price for 2 Weeks",
    cell: ({ row }) => `$${row.original.priceFor2weeks.toFixed(2)}`,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions data={row.original} />,
  },
];

// const form = useForm<z.infer<typeof EmployeeSchema>>({
//   resolver: zodResolver(EmployeeSchema),
//   defaultValues: {
//     name: defaultData?.name || "",
//     email: defaultData?.email || "",
//     age: defaultData?.age || 0,
//   },
// });
// const [isPending, startTransition] = useTransition();
// const router = useRouter();
// console.log(form.formState.errors);
// async function onSubmit(data: z.infer<typeof EmployeeSchema>) {
//   startTransition(async () => {
//     console.log(data);
//     const res = defaultData?._id ? await UpdateEmployee(defaultData?._id, data) : await CreateEmployee(data);
//     if (res.success) {
//       toast.success(res.message);
//       router.refresh();
//     } else toast.error(res.error);
//   });
// }
