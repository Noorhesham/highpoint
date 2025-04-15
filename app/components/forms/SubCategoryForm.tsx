"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ArabicEnglishForm from "./ArabicEnglishForm";
import { createEntity, deleteEntity, updateEntity } from "@/app/actions/actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon } from "lucide-react";
const subCategorySchema = z.object({
  name: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "Required" }),
  }),
  parentCategory: z.string().min(1, { message: "Required" }),
});
const SubCategoryForm = ({
  defaultValue,
  stateSetter,
  index,
  parentCategory,
  className,
  onSucess,
}: {
  defaultValue: any;
  stateSetter: React.Dispatch<React.SetStateAction<any>>;
  parentCategory: string;
  index: number;
  className?: string;
  onSucess?: any;
}) => {
  console.log(defaultValue);
  const form = useForm<z.infer<typeof subCategorySchema>>({
    defaultValues: {
      name: { ar: defaultValue?.name.ar || "", en: defaultValue?.name.en || "" },
      parentCategory,
    },
    resolver: zodResolver(subCategorySchema),
  });
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      const res = defaultValue._id
        ? await updateEntity("SubCategory", defaultValue._id, data)
        : await createEntity("SubCategory", data);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
        onSucess?.();
      } else toast.error(res.error);
    });
  };

  const handleDeleteSubCategory = async (index: number) => {
    startTransition(async () => {
      if (!defaultValue) return stateSetter((prev: any) => prev.filter((_: any, i: number) => i !== index));
      const res = await deleteEntity("SubCategory", defaultValue._id);
      if (res.success) {
        toast.success(res.success);
        stateSetter((prev: any) => prev.filter((_: any, i: number) => i !== index));
        router.refresh();
      } else toast.error(res.error);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2 border py-4 px-2 ">
          <ArabicEnglishForm nodesc name={`name`}>
            <div className={`flex gap-2 ${className}`}>
              <Button disabled={isPending} type="submit">
                {defaultValue ? "Update" : "Save"} <SaveIcon />
              </Button>
              <Button
                disabled={isPending}
                type="button"
                variant="destructive"
                onClick={() => handleDeleteSubCategory(index)}
              >
                Delete <TrashIcon />
              </Button>
            </div>
          </ArabicEnglishForm>
        </div>
      </form>
    </Form>
  );
};

export default SubCategoryForm;
