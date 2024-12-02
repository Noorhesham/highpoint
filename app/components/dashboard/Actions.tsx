import React, { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, buttonVariants } from "@/components/ui/button";
import ModalCustom from "../defaults/ModalCustom";
import { MoreHorizontal } from "lucide-react";
import { deleteEntity } from "@/app/actions/actions";
import { DialogClose } from "@/components/ui/dialog";
import { ModelProps } from "@/app/constant";
import CategoriesForm from "../forms/CategoriesForm";
import CoursesForm from "../forms/CoursesForm";

const Actions = ({ data, entity }: { data: any; entity: ModelProps }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteEntity(entity, id);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else toast.error(res.error);
    });
  };
  const returnFormFromEntity = (entity: string) => {
    switch (entity) {
      case "Employee":
        return EmployeeForm;
      case "Category":
        return <CategoriesForm categories={data} />;
      case "City":
        return CityForm;
      case "Course":
        return <CoursesForm course={data} />;
      default:
        return null;
    }
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
            btn={<div className={`${buttonVariants({ variant: "default" })} cursor-pointer w-full`}>Edit</div>}
            content={returnFormFromEntity(entity)}
          />
          <ModalCustom
            title="Update user data"
            btn={<div className={`${buttonVariants({ variant: "destructive" })} cursor-pointer w-full`}> Delete</div>}
            content={
              <div className=" w-full flex items-center gap-5 flex-col ">
                <p>Are you sure you want to delete this employee ?</p>
                <div className="  w-full flex items-center gap-4 max-w-lg mx-auto">
                  <DialogClose className={`${buttonVariants({ variant: "outline" })} w-full `}>Cancel</DialogClose>
                  <Button
                    variant="destructive"
                    className=" w-full"
                    onClick={() => handleDelete(data._id)}
                    disabled={isPending}
                  >
                    Delete this {entity} ?
                  </Button>
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
