"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ArabicEnglishForm from "./ArabicEnglishForm";
import FileUpload from "./FileUpload";
import { uploadImageToCloudinary } from "@/app/utils/fn";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { CityProps } from "@/app/models/City";

const CitySchema = z.object({
  name: z.object({
    ar: z.string().min(1, { message: "City name in Arabic is required" }),
    en: z.string().min(1, { message: "City name in English is required" }),
  }),
  image: z.any().optional(),
});

const CityForm = ({ city }: { city?: CityProps }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof CitySchema>>({
    defaultValues: {
      name: city?.name || { ar: "", en: "" },
      image: city?.image || null,
    },
    resolver: zodResolver(CitySchema),
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        if (data.image instanceof File) {
          const imageUpload = await uploadImageToCloudinary(data.image);
          data.image = { secure_url: imageUpload.secure_url, public_id: imageUpload.public_id };
        }

        const res = city
          ? await updateEntity("City", city._id, data, [city.name.en, city.name.ar])
          : await createEntity("City", data);

        if (res.success) {
          toast.success("City saved successfully.");
          router.refresh();
        }
      } catch (error) {
        console.error("Error saving city data:", error);
        toast.error("Error saving city data. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <ArabicEnglishForm nodesc name="name" label="City Name" descName={undefined} />
        <FileUpload name="image" label="City Image" />

        <Button disabled={isPending} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CityForm;
