"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ArabicEnglishForm from "./ArabicEnglishForm";
import PhotoInput from "./PhotoInput";
import MiniTitle from "../defaults/MiniTitle";
import SubCategoryForm from "./SubCategoryForm";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useGetEntity } from "@/app/queries";
import { CategoryProps } from "@/app/models/Category";
import Paragraph from "../defaults/Paragraph";

const CategoriesSchema = z.object({
  name: z.object({
    ar: z.string().min(1, { message: "Required" }),
    en: z.string().min(1, { message: "Required" }),
  }),
  description: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  mainImage: z.any(),
});
export type SubCategoryType = {
  _id?: string;
  name: {
    ar: string;
    en: string;
  };
};
const CategoriesForm = ({ categories }: { categories?: CategoryProps }) => {
  const [subCategoriesState, setSubCategoriesState] = useState<Array<SubCategoryType>>(categories?.subCategories || []);
  const form = useForm<z.infer<typeof CategoriesSchema>>({
    defaultValues: {
      name: categories?.name || { ar: "", en: "" },
      description: categories?.description || { ar: "", en: "" },
      mainImage: categories?.mainImage[0] || [],
    },
    resolver: zodResolver(CategoriesSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { reset } = form;

  const handleImageUpload = async (mainImage: any) => {
    const formData = new FormData();
    formData.append("file", mainImage);
    formData.append("upload_preset", "ml_default");

    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload photo");
    return res.json();
  };

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        if (data?.mainImage instanceof File) {
          const { secure_url, public_id } = await handleImageUpload(data.mainImage);
          data.mainImage = { secure_url, public_id };
        }

        const res = categories
          ? await updateEntity("Category", categories._id, data)
          : await createEntity("Category", data);

        if (res.success) {
          toast.success(res.success);
          router.refresh();
          reset({
            name: data.name,
            description: data.description,
            mainImage: data.mainImage,
          });
        } else {
          toast.error(res.error);
        }
      } catch (error) {
        console.error("Error during submission:", error);
      }
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <PhotoInput value={categories?.mainImage[0]?.secure_url} name="mainImage" />
          <ArabicEnglishForm name="name" />
          <Button disabled={isPending}>{categories ? "Update" : "Add"} Category</Button>
          <MiniTitle text="Sub Categories" size="md" className="my-4" />
        </form>
      </Form>
      {categories &&
        subCategoriesState.map((subCategory, index) => (
          <SubCategoryForm
            parentCategory={categories._id}
            key={index}
            index={index}
            defaultValue={subCategory}
            stateSetter={setSubCategoriesState}
          />
        ))}{" "}
      {categories ? (
        <Button
          type="button"
          className="my-3 w-fit"
          onClick={() => setSubCategoriesState([...subCategoriesState, { name: { ar: "", en: "" } }])}
        >
          Add Sub Category
        </Button>
      ) : (
        <Paragraph
          className=" !text-gray-800"
          description="You can add sub categories only after creating a category"
        />
      )}
    </div>
  );
};

export default CategoriesForm;
