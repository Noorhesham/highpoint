"use client";
import { createEntity, updateEntity } from "@/app/actions/actions";
import React from "react";
import { toast } from "react-toastify";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { CourseProps } from "@/app/models/Course";
import { Form } from "@/components/ui/form";
import PhotoInput from "./PhotoInput";
import ArabicEnglishForm from "./ArabicEnglishForm";
import { Button } from "@/components/ui/button";
import FormSelect from "./FormSelect";
import { useGetEntity } from "@/app/queries";
import { useLocale } from "next-intl";
import FormInput from "./FormInput";
import FlexWrapper from "../defaults/FlexWrapper";
import GridContainer from "../defaults/GridContainer";
import FileUpload from "./FileUpload";
const CoursesSchema = z.object({
  name: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  description: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  images: z.any(),
  category: z.string().min(1, { message: "Required" }),
  price: z.union([z.number(), z.string().min(1)]),
  serialNumber: z.union([z.number(), z.string().min(1)]),
  duration: z.union([z.number(), z.string().min(1)]),
});
const CoursesForm = ({ course }: { course?: CourseProps | null }) => {
  const form = useForm<z.infer<typeof CoursesSchema>>({
    defaultValues: {
      name: { ar: course?.name.ar || "", en: course?.name.en || "" },
      description: { ar: course?.description.ar || "", en: course?.description.en || "" },
      images: course?.images.map((image) => image.secure_url) || [{}],
      category: course?.category || "",
      price: course?.price || 0,
      serialNumber: course?.serialNumber || 0,
      duration: course?.duration || 0,
    },
    resolver: zodResolver(CoursesSchema),
  });
  const { data, isLoading } = useGetEntity({ entityName: "Category", key: "categories" });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "images",
  });
  console.log(course);
  const onSubmit = async (data: any) => {
    console.log(data);
    startTransition(async () => {
      if (data.images.length > 0) {
        try {
          const uploadedImages = await Promise.all(
            data.images.map(async (image: File | string, index: number) => {
              if (typeof image === "string") {
                return image;
              }

              const formData = new FormData();
              formData.append("file", image);
              formData.append("upload_preset", "ml_default");

              const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                const errorResponse = await res.json();
                console.error("Cloudinary Error:", errorResponse);
                throw new Error("Failed to upload photo");
              }

              const cloudinaryData = await res.json();
              return {
                secure_url: cloudinaryData.secure_url,
                public_id: cloudinaryData.public_id,
              };
            })
          );

          data.images = uploadedImages;

          // Call your create or update function after all images are uploaded
          const res = course ? await updateEntity("Course", course._id, data) : await createEntity("Course", data);

          if (res.success) {
            toast.success(res.success);
            router.refresh();
          } else {
            toast.error(res.error);
          }
        } catch (error) {
          console.error("Photo upload failed:", error);
          toast.error("Failed to upload images");
        }
      }
      console.log(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <GridContainer cols={fields.length < 2 ? 1 : 2}>
          {fields.map((field, index) => (
            <FileUpload label="" key={field.id} name={`images.${index}`} />
          ))}
        </GridContainer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            append({});
          }}
        >
          Add More
        </Button>
        <ArabicEnglishForm />
        <GridContainer cols={3} className=" gap-4">
          <FormInput name="price" label="Price" placeholder="Price" type="number" />
          <FormInput name="serialNumber" label="Serial Number" placeholder="Serial Number" type="number" />
          <FormInput name="duration" label="Duration" placeholder="Duration" type="number" />
        </GridContainer>

        <FormSelect
          disabled={isLoading || !data}
          locale={course ? locale : ""}
          options={!isLoading && data ? data?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] })) : []}
          name="category"
          label="Category"
          placeholder="Select Category"
        />
        <Button disabled={isPending}>{course ? "Update" : "Add"} Course</Button>
      </form>
    </Form>
  );
};
export default CoursesForm;
