"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EmployeeProps } from "../models/employeeModel";
import Actions from "../components/Actions";

export const columns: ColumnDef<EmployeeProps>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "age",
    header: "Age",
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
