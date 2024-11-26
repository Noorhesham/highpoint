import React, { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ModalCustom from "../components/ModalCustom";
import { DialogClose } from "@/components/ui/dialog";
import EmployeeForm from "../components/EmployeeForm";
import { buttonVariants } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteEmployee } from "../actions/actions";
import { toast } from "react-toastify";
import CustomButton from "./CustomButton";
const Actions = ({ data }: { data: any }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await DeleteEmployee(id);
      if (res.success) {
        toast.success(res.message);
        router.refresh();
      } else toast.error(res.error);
    });
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className=" flex flex-col gap-2">
          <ModalCustom
            title="Update user data"
            btn={<div className={`${buttonVariants({ variant: "default" })} w-full`}>Edit</div>}
            content={<EmployeeForm defaultData={data} />}
          />
          <ModalCustom
            title="Update user data"
            btn={<div className={`${buttonVariants({ variant: "destructive" })} w-full`}> Delete</div>}
            content={
              <div className=" w-full flex flex-col gap-4">
                <p>Are you sure you want to delete this employee ?</p>
                <div className=" flex items-center gap-4">
                  <CustomButton
                    onClick={() => handleDelete(data._id)}
                    disabled={isPending}
                    text={` Delete ${data.name.slice(0, 10)} ?`}
                  />
                  <DialogClose className={`${buttonVariants({ variant: "destructive" })} `}>Cancel</DialogClose>
                </div>
              </div>
            }
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
