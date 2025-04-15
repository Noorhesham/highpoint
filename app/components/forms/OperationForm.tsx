"use client";
import { createEntity, deleteEntity, updateEntity } from "@/app/actions/actions";
import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { OperationProps } from "@/app/models/Operations";
import { Form } from "@/components/ui/form";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import FormSelect from "./FormSelect";
import GridContainer from "../defaults/GridContainer";
import { useGetEntity } from "@/app/queries";
import { useLocale, useTranslations } from "next-intl";

const OperationSchema = z.object({
  startDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
  city: z.string().min(1, { message: "Required" }),
  duration: z.union([z.number(), z.string().min(1)]),
  price: z.union([z.number(), z.string().min(1)]),
  course: z.string().min(1, { message: "Required" }),
  endDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
});

const formatDateForInput = (date?: Date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const OperationForm = ({
  operation,
  courseId,
  removeOperationn,
}: {
  operation?: OperationProps | null;
  courseId?: string;
  removeOperationn?: any;
}) => {
  const { data: cities, isLoading } = useGetEntity({ entityName: "City", key: "city" });
  const locale = useLocale();
  const t = useTranslations();
  const form = useForm<z.infer<typeof OperationSchema>>({
    defaultValues: {
      startDate: formatDateForInput(operation?.startDate) || new Date(),
      city: operation?.city || "",
      duration: operation?.duration || 0,
      price: operation?.price || 0,
      course: courseId,
      endDate: formatDateForInput(operation?.endDate) || new Date(),
    },
    resolver: zodResolver(OperationSchema),
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const res = operation._id
          ? await updateEntity("Operation", operation._id, data)
          : await createEntity("Operation", data);

        if (res?.success) {
          toast.success(res?.success);
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("Submission failed. Please try again.");
      }
    });
  };
  console.log(form.formState.errors);
  const remove = () => {
    if (operation._id) {
      startTransition(async () => {
        try {
          const res = await deleteEntity("Operation", operation._id);
          if (res?.success) {
            toast.success(res?.success);
            removeOperationn();
            router.refresh();
          } else {
            toast.error(res.error);
          }
        } catch (error) {
          console.error("Error during submission:", error);
          toast.error("Submission failed. Please try again.");
        }
      });
    } else removeOperationn();
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <GridContainer cols={4}>
            <FormInput name="price" label="Price" placeholder="Price" type="number" />
            <FormInput calendar name="startDate" label="Start Date" placeholder="Start Date" type="date" />
            <FormInput calendar name="endDate" label="End Date" placeholder="End Date" type="date" />{" "}
            <FormSelect
              disabled={isLoading || !cities}
              locale={locale}
              options={
                !isLoading && cities ? cities?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] })) : []
              }
              name="city"
              label="City"
              placeholder={t("selectCity")}
            />
          </GridContainer>

          <Button disabled={isPending} className="self-end w-fit">
            {operation._id ? "Update" : "Add"}{" "}
          </Button>
        </form>
      </Form>{" "}
      <Button variant={'destructive'}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          remove();
        }}
      >
        Remove
      </Button>
    </div>
  );
};

export default OperationForm;
