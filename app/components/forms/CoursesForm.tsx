"use client";
import { createEntity, updateEntity } from "@/app/actions/actions";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { CourseProps } from "@/app/models/Course";
import { Form } from "@/components/ui/form";
import ArabicEnglishForm from "./ArabicEnglishForm";
import { Button } from "@/components/ui/button";

import FormInput from "./FormInput";
import GridContainer from "../defaults/GridContainer";
import FileUpload from "./FileUpload";
import CategoriesInput from "./CountriesInput";
import { useGetEntity } from "@/app/queries";
import City from "@/app/models/City";
import { useLocale, useTranslations } from "next-intl";
import FormSelect from "./FormSelect";
import FormTitle from "../FormTitle";
import OperationForm from "./OperationForm";
import DescInput from "./DescInput";
import { uploadImageToCloudinary } from "@/app/utils/fn";
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
  subCategories: z.array(z.string()),
  city: z.string().min(1, { message: "Required" }),
  days: z.array(z.object({ ar: z.string(), en: z.string() }).optional()),
  shortDescription: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  courseContent: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  certificate: z.object({
    image: z.any().optional(),
  }),
  status: z.string().min(1, { message: "Required" }),
});
const formatDateForInput = (date?: Date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const CoursesForm = ({ course }: { course?: CourseProps | null }) => {
  console.log(course);
  const { data: cities, isLoading } = useGetEntity({ entityName: "City", key: "city" });
  const locale = useLocale();
  const form = useForm<z.infer<typeof CoursesSchema>>({
    defaultValues: {
      name: { ar: course?.name?.ar || "", en: course?.name?.en || "" },
      description: { ar: course?.description?.ar || "", en: course?.description?.en || "" },
      images: course?.images || [{}],
      category: course?.category || "",
      price: course?.price || 0,
      serialNumber: course?.serialNumber || 0,
      duration: course?.duration || 0,
      startDate: formatDateForInput(course?.startDate) || new Date(),
      endDate: formatDateForInput(course?.endDate) || new Date(),
      subCategories: course?.subCategories || [],
      city: course?.city || "",
      days: course?.days || [{}],
      shortDescription: course?.shortDescription || "",
      certificate: course?.certificate || "",
      courseContent: course?.courseContent || "",
      status: course?.status || "draft",
    },
    resolver: zodResolver(CoursesSchema),
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { fields, append } = useFieldArray({
    control: form.control,
    name: "images",
  });
  const [operations, setOperations] = React.useState(course?.operations || [1]);
  const removeOperation = (index: number) => {
    setOperations((prevOperations) => prevOperations.filter((_, i) => i !== index));
  };
  const addOperation = () => {
    setOperations((prevOperations) => [...prevOperations, {}]);
  };
  const {
    fields: days,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });
  useEffect(() => {
    const errors = form.formState.errors;
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((error) => error.message)
        .join(", ");
      toast.error(`Please fix the following errors: ${errorMessages}`);
    }
  }, [form.formState.errors]);
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        // Filter and process valid images  console.log(course);
        console.log(data);
        const filteredImages =
          Array.isArray(data?.images) &&
          data.images?.some((image) => image !== null && (image instanceof File || Object.keys(image).length > 0))
            ? data.images?.filter((image: any) => {
                console.log(image);
                if (image?.secure_url !== "" || image instanceof File) return image;
              })
            : [];
        if (data?.certificate?.image && data?.certificate?.image instanceof File) {
          const certificateImageUpload = await uploadImageToCloudinary(data.certificate.image);
          data.certificate.image = {
            secure_url: certificateImageUpload.secure_url,
            public_id: certificateImageUpload.public_id,
          };
        }
        const uploadedImages = await Promise.all(
          filteredImages?.map(async (image: File | { secure_url: string; public_id: string }) => {
            console.log(image, data);
            if (image?.secure_url && image?.secure_url !== "") {
              return image;
            }
            if (!(image instanceof File)) {
              throw new Error("Invalid image type: Expected a File instance");
            }
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
          // if (!course) router.push(`/dashboard/edit-Course/${res?.data?.[0]?._id}`);
        }
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("Submission failed. Please try again.");
      }
    });
  };
  const t = useTranslations();
  return (
    <div>
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
          <FormSelect
            options={[
              { value: "draft", name: "Draft" },
              { value: "published", name: "Published" },
              { value: "archived", name: "Archived" },
            ]}
            name="status"
            label="Status"
            placeholder="Status"
          />
          <ArabicEnglishForm nodesc />

          <ArabicEnglishForm labeldESC={t("Short Description")} noName descName={"shortDescription"} />
          <ArabicEnglishForm labeldESC={t("Description")} noName descName={"description"} />
          <ArabicEnglishForm labeldESC={t("contnetcourse")} noName descName={"courseContent"} />
          <GridContainer cols={3} className=" gap-4">
            <FormInput name="price" label="Price" placeholder="Price" type="number" />
            <FormInput name="serialNumber" label="Serial Number" placeholder="Serial Number" type="number" />
            <FormInput name="duration" label="Duration" placeholder="Duration" type="number" />
            <FormInput calendar name="startDate" label="start date" placeholder="Duration" type="number" />
            <FormInput calendar name="endDate" label="end date" placeholder="Duration" type="number" />
          </GridContainer>
          <CategoriesInput subCategory={"subCategories"} categoryName="category" />
          <FormSelect
            disabled={isLoading || !cities}
            locale={course ? locale : ""}
            options={
              !isLoading && cities ? cities?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] })) : []
            }
            name="city"
            label="City"
            placeholder={t("selectCity")}
          />
          <FormTitle text={t("days")} />

          {days.map((day, index) => (
            <div className="flex  gap-2" key={day.id}>
              <DescInput name={`days.${index}`} label={`Day ${index + 1}`} />
              <Button className="self-end w-fit" variant={"destructive"} onClick={() => removeDay(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button
            className=" mt-5 w-fit ml-auto"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              appendDay({ en: "", ar: "" });
            }}
          >
            Add Day
          </Button>
          <div className="flex flex-col gap-4">
            <FormTitle text={t("certificate")} />
            <FileUpload label="صورة الشهادة" name={`certificate.image`} />
          </div>

          <Button disabled={isPending}>{course ? "Update" : "Add"} Course</Button>
        </form>
      </Form>
      {course && (
        <>
          {" "}
          <FormTitle text="Course Convening" />
          {operations.map((operation, index) => (
            <div key={index}>
              <OperationForm
                removeOperationn={() => removeOperation(index)}
                courseId={course._id}
                operation={operation}
              />
            </div>
          ))}
          <Button className=" mt-5" onClick={() => addOperation()}>
            Add Convening
          </Button>
        </>
      )}
    </div>
  );
};
export default CoursesForm;
