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
import ExportToPDF from "../ExportToPdf";
import CalendarInput from "./CalendarInput";
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
  category: z.union([
    z.string().min(1, { message: "Required" }),
    z.object({
      _id: z.string(),
      name: z.object({ ar: z.string(), en: z.string() }).optional(),
    }),
  ]),
  price: z.union([z.number(), z.string().min(1)]),
  serialNumber: z.union([z.number(), z.string().min(1)]),
  duration: z.union([z.number(), z.string().min(1)]),
  startDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
  endDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
});
const formatDateForInput = (date?: Date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const CoursesForm = ({ course }: { course?: CourseProps | null }) => {
  console.log(course);
  const form = useForm<z.infer<typeof CoursesSchema>>({
    defaultValues: {
      name: { ar: course?.name.ar || "", en: course?.name.en || "" },
      description: { ar: course?.description.ar || "", en: course?.description.en || "" },
      images: course?.images.map((image) => image.secure_url) || [{}],
      category: course?.category || "",
      price: course?.price || 0,
      serialNumber: course?.serialNumber || 0,
      duration: course?.duration || 0,
      startDate: formatDateForInput(course?.startDate) || new Date(),
      endDate: formatDateForInput(course?.endDate) || new Date(),
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
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        // Filter and process valid images  console.log(course);
        console.log(course);

        const uploadedImages = await Promise.all(
          data.images
            .filter((img: any) => img) // Remove empty or invalid entries
            ?.map(async (image: File | { secure_url: string; public_id: string }) => {
              console.log(image);
              if (image?.secure_url) {
                return image;
              }

              // Prepare form data for image upload
              const formData = new FormData();
              formData.append("file", image);
              formData.append("upload_preset", "ml_default");

              // Upload image to Cloudinary
              const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
                method: "POST",
                body: formData,
              });

              if (!res.ok) {
                const errorResponse = await res.json();
                console.error("Cloudinary Error:", errorResponse);
                throw new Error("Failed to upload an image");
              }

              const cloudinaryData = await res.json();
              return {
                secure_url: cloudinaryData.secure_url,
                public_id: cloudinaryData.public_id,
              };
            })
        );
        console.log(uploadedImages, "Uploaded Images:");
        // Replace images in the data object
        data.images = uploadedImages;
        console.log(data, "Form Data After Processing:", data);
        // Create or update the course entity
        const res = course ? await updateEntity("Course", course._id, data) : await createEntity("Course", data);
        console.log(res);
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
            e.preventDefault();
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
          <FormInput calendar name="startDate" label="start date" placeholder="Duration" type="number" />
          <FormInput calendar name="endDate" label="end date" placeholder="Duration" type="number" />
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
