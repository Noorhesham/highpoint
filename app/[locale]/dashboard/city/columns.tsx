"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CityProps } from "@/app/models/City";
import Actions from "@/app/components/dashboard/Actions";
import LocaleData from "@/app/components/LocaleData";
import Image from "next/image";

export const columns: ColumnDef<CityProps>[] = [
  {
    accessorKey: "name",
    header: "Name ",
    cell: ({ row }) => <LocaleData data={row.original.name} />,
  },
  {
    accessorKey: "mainImage",
    header: "",
    cell: ({ row }) => (
      <div className="w-16 rounded-xl overflow-hidden h-16 relative">
        <Image src={row.original.image?.secure_url} alt={row.original.name} className=" object-cover" fill />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions entity="City" data={row.original} />,
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
