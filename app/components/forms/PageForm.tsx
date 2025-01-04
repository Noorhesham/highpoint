"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ArabicEnglishForm from "./ArabicEnglishForm";
import FormInput from "./FormInput";
import FileUpload from "./FileUpload";
import { uploadImageToCloudinary } from "@/app/utils/fn";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createEntity, updateEntity } from "@/app/actions/actions";
import MiniTitle from "../defaults/MiniTitle";

const ReusablePageSchema = z.object({
  name: z.string().min(1, { message: "Page name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  sections: z.array(
    z.object({
      title: z.object({
        ar: z.string().min(1, { message: "Title in Arabic is required" }),
        en: z.string().min(1, { message: "Title in English is required" }),
      }),
      desc: z.object({
        ar: z.string().optional(),
        en: z.string().optional(),
      }),
      image: z.any().optional(),
    })
  ),
  metadata: z.object({
    title: z.string().min(1, { message: "Meta title is required" }),
    description: z.string().optional(),
    keywords: z.string().optional(),
  }),
  createdAt: z.date().optional(),
});

const PageForm = ({ page }: { page?: any }) => {
  console.log(page);
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof ReusablePageSchema>>({
    defaultValues: {
      name: page?.name || "",
      slug: page?.slug || "",
      sections: page?.sections || [],
      metadata: page?.metadata || {
        title: "",
        description: "",
        keywords: [],
      },
    },
    resolver: zodResolver(ReusablePageSchema),
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: "sections",
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        data.sections = await Promise.all(
          data.sections.map(async (section: any) => {
            if (section.image instanceof File) {
              const imageUpload = await uploadImageToCloudinary(section.image);
              section.image = { secure_url: imageUpload.secure_url, public_id: imageUpload.public_id };
            }
            return section;
          })
        );

        const res = page ? await updateEntity("Page", page._id, data, [page.slug]) : await createEntity("Page", data);

        if (res.success) {
          toast.success("Page saved successfully.");
          router.refresh();
        }
      } catch (error) {
        console.error("Error saving page data:", error);
        toast.error("Error saving page data. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Page Name */}
        <FormInput placeholder="Page Name" name="name" label="Page Name" />

        {/* Slug */}
        <FormInput placeholder="Slug" name="slug" label="Slug" />

        {/* Metadata */}
        <MiniTitle text="Metadata" />
        <FormInput placeholder="Meta Title" name="metadata.title" label="Meta Title" />
        <FormInput placeholder="Meta Description" name="metadata.description" label="Meta Description" />
        <FormInput placeholder="Meta Keywords" name="metadata.keywords" label="Meta Keywords (comma-separated)" />

        {/* Sections */}
        {sectionFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md">
            <ArabicEnglishForm
              descName={`sections.${index}.desc`}
              name={`sections.${index}.title`}
              label={`Section ${index + 1} Title`}
            />
            <FileUpload name={`sections.${index}.image`} label={`Section ${index + 1} Image`} />{" "}
            <Button
              className=" w-fit ml-auto"
              variant={"destructive"}
              disabled={isPending}
              type="button"
              onClick={() => removeSection(index)}
            >
              Remove Section
            </Button>
          </div>
        ))}
        <Button
          disabled={isPending}
          onClick={() => appendSection({ title: { ar: "", en: "" }, desc: { ar: "", en: "" }, image: null })}
        >
          Add Section
        </Button>

        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PageForm;
