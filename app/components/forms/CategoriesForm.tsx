"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import ArabicEnglishForm from "./ArabicEnglishForm";
import { CategoryProps } from "@/app/models/Category";
import { createEntity, updateEntity } from "@/app/actions/actions";
import PhotoInput from "./PhotoInput";

const CategoriesSchema = z.object({
  name: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  description: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "الحقل مطلوب" }),
  }),
  mainImage: z.any(),
});

const CategoriesForm = ({ categories }: { categories?: CategoryProps }) => {
  const form = useForm<z.infer<typeof CategoriesSchema>>({
    defaultValues: {
      name: { ar: categories?.name.ar || "", en: categories?.name.en || "" },
      description: { ar: categories?.description.ar || "", en: categories?.description.en || "" },
      mainImage: categories?.mainImage || [],
    },
    resolver: zodResolver(CategoriesSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    console.log(data);
    startTransition(async () => {
      if (data.mainImage) {
        const formData = new FormData();
        formData.append("file", data.mainImage);
        formData.append("upload_preset", "ml_default");
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
            method: "POST",
            body: formData,
          });

          console.log(res);
          if (!res.ok) {
            const errorResponse = await res.json(); // Show Cloudinary error details
            console.error("Cloudinary Error:", errorResponse);
            throw new Error("Failed to upload photo");
          }

          const cloudinaryData = await res.json();
          data.mainImage = {
            secure_url: cloudinaryData.secure_url,
            public_id: cloudinaryData.public_id,
          };
        } catch (error) {
          console.error("Photo upload failed:", error);
          return;
        }
      }
      const res = categories
        ? await updateEntity("Category", categories._id, data)
        : await createEntity("Category", data);
      console.log(res);
      if (res.success) {
        toast.success(res.success);
        router.refresh();
      } else toast.error(res.error);
    });
  };
  console.log(form.formState.errors);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <PhotoInput value={categories?.mainImage} name={"mainImage"} />
        <ArabicEnglishForm />
        <Button disabled={isPending}>{categories ? "Update" : "Add"} Categories</Button>
      </form>
    </Form>
  );
};

export default CategoriesForm;
