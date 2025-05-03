"use client";
import { createEntity, updateEntity } from "@/app/actions/actions";
import React, { useEffect, useState } from "react";
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
import { Calendar, CalendarRange, Check, ListPlus, Plus, Save } from "lucide-react";

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

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const CoursesForm = ({ course }: { course?: CourseProps | null }) => {
  const { data: cities, isLoading } = useGetEntity({ entityName: "City", key: "city" });
  const locale = useLocale();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [operations, setOperations] = useState<any[]>(course?.operations || []);
  const [generatedOperations, setGeneratedOperations] = useState<any[]>([]);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);

  const form = useForm<z.infer<typeof CoursesSchema>>({
    defaultValues: {
      name: { ar: course?.name?.ar || "", en: course?.name?.en || "" },
      description: { ar: course?.description?.ar || "", en: course?.description?.en || "" },
      images: course?.images || [{}],
      category: course?.category || "",
      price: course?.price || 0,
      serialNumber: course?.serialNumber || getRandomInt(1000, 9999),
      duration: course?.duration || 5,
      startDate: formatDateForInput(course?.startDate) || new Date(),
      endDate: formatDateForInput(course?.endDate) || new Date(),
      subCategories: course?.subCategories || [],
      city: course?.city || "",
      days: course?.days || [{}],
      shortDescription: course?.shortDescription || { ar: "", en: "" },
      certificate: course?.certificate || { image: null },
      courseContent: course?.courseContent || { ar: "", en: "" },
      status: course?.status || "draft",
    },
    resolver: zodResolver(CoursesSchema),
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const {
    fields: days,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const removeOperation = (index: number) => {
    setOperations((prevOperations) => prevOperations.filter((_, i) => i !== index));
  };

  const addOperation = () => {
    setOperations((prevOperations) => [...prevOperations, {}]);
  };

  // Handle bulk operations generated from the OperationForm component
  const handleGeneratedOperations = (newOperations: any[]) => {
    setGeneratedOperations(newOperations);
    toast.success(`Generated ${newOperations.length} operations for a full year`);
  };

  // Submit all generated operations to the database
  const submitAllOperations = async () => {
    if (!course || !course._id || generatedOperations.length === 0) {
      toast.error("No operations to submit or course not saved");
      return;
    }

    setIsSubmittingAll(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const operationsWithCourse = generatedOperations.map((op) => ({
        ...op,
        course: course._id,
      }));

      // Process operations in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < operationsWithCourse.length; i += batchSize) {
        const batch = operationsWithCourse.slice(i, i + batchSize);

        // Submit operations in parallel
        const results = await Promise.all(
          batch.map((operation) =>
            createEntity("Operation", operation)
              .then((res) => {
                if (res?.success) successCount++;
                return res;
              })
              .catch((err) => {
                errorCount++;
                console.error("Error creating operation:", err);
                return { error: err.message };
              })
          )
        );
      }

      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} operations`);
        if (errorCount > 0) {
          toast.warning(`Failed to create ${errorCount} operations`);
        }
        router.refresh();

        // Update operations list with newly created ones
        setOperations((prev) => [...prev, ...generatedOperations]);
        setGeneratedOperations([]);
      } else {
        toast.error("Failed to create any operations");
      }
    } catch (error) {
      console.error("Error submitting operations:", error);
      toast.error("Failed to submit operations. Please try again.");
    } finally {
      setIsSubmittingAll(false);
    }
  };

  useEffect(() => {
    const errors = form.formState.errors;
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
        // Filter and process valid images
        const filteredImages =
          Array.isArray(data?.images) &&
          data.images?.some((image) => image !== null && (image instanceof File || Object.keys(image).length > 0))
            ? data.images?.filter((image: any) => {
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
            if ("secure_url" in image && image.secure_url !== "") {
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

        // Replace images in the data object
        data.images = uploadedImages;

        // Create or update the course entity
        const res = course ? await updateEntity("Course", course._id, data) : await createEntity("Course", data);

        if (res?.success) {
          toast.success(res?.success);
          router.refresh();
        }
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("Submission failed. Please try again.");
      }
    });
  };

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
            <div className="flex gap-2" key={day.id}>
              <DescInput name={`days.${index}`} label={`Day ${index + 1}`} />
              <Button className="self-end w-fit" variant={"destructive"} onClick={() => removeDay(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button
            className="mt-5 w-fit ml-auto"
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

          <Button disabled={isPending} className="mb-8">
            {course ? "Update" : "Add"} Course
          </Button>
        </form>
      </Form>

      {course && (
        <div className="border-t border-gray-200 pt-6 mt-4">
          <div className="flex justify-between items-center mb-4">
            <FormTitle text={t("Course Schedule")} />

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={addOperation}>
                <Plus className="h-4 w-4" />
                {t("Add Session")}
              </Button>

              {generatedOperations.length > 0 && (
                <Button
                  size="sm"
                  variant="default"
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                  onClick={submitAllOperations}
                  disabled={isSubmittingAll}
                >
                  <Save className="h-4 w-4" />
                  {isSubmittingAll ? t("Submitting...") : t("Submit All")}
                  {isSubmittingAll && <span className="ml-1 inline-block animate-spin">⟳</span>}
                </Button>
              )}
            </div>
          </div>

          {/* Display a summary of generated operations if any */}
          {generatedOperations.length > 0 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 flex items-center gap-2 mb-2">
                <CalendarRange className="h-4 w-4" />
                {t("Generated Operations")}
              </h3>
              <p className="text-xs text-blue-600 mb-2">
                {t("Generated")} {generatedOperations.length} {t("sessions across")} {cities?.data?.data.length}{" "}
                {t("cities")} {t("for a full year")}
              </p>
              <div className="flex flex-wrap gap-2">
                {cities?.data?.data.slice(0, 5).map((city: any) => (
                  <span key={city._id} className="bg-white text-xs px-2 py-1 rounded border border-blue-200">
                    {city.name[locale]}
                  </span>
                ))}
                {cities?.data?.data.length > 5 && (
                  <span className="bg-white text-xs px-2 py-1 rounded border border-blue-200">
                    +{cities.data.data.length - 5} {t("more")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Display added operations */}
          <div className="space-y-4">
            {operations.length > 0 ? (
              operations.map((operation, index) => (
                <div key={index}>
                  <OperationForm
                    removeOperationn={() => removeOperation(index)}
                    courseId={course._id}
                    operation={operation}
                    isNew={!operation._id}
                    onGenerateAll={handleGeneratedOperations}
                  />
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 text-center">
                <Calendar className="h-8 w-8 mx-auto opacity-40 mb-3" />
                <p className="text-gray-500">{t("No sessions scheduled yet")}</p>
                <Button onClick={addOperation} variant="outline" size="sm" className="mt-4">
                  {t("Add Your First Session")}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesForm;
