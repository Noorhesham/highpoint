"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import ArabicEnglishForm from "./ArabicEnglishForm";
import FormInput from "./FormInput";
import FileUpload from "./FileUpload";
import GridContainer from "../defaults/GridContainer";
import { z } from "zod";
import { uploadImageToCloudinary } from "@/app/utils/fn";
import { toast } from "react-toastify";
import { createEntity, updateEntity } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { HomeProps } from "@/app/models/Home";

export const HomePageSchema = z.object({
  mainCover: z.any().optional(),
  mainTitle: z.object({
    ar: z.string().min(1, { message: "الحقل مطلوب" }),
    en: z.string().min(1, { message: "Required" }),
  }),
  mainDesc: z.object({
    ar: z.string().min(1, { message: "الحقل مطلوب" }),
    en: z.string().min(1, { message: "Required" }),
  }),
  secondaryCover: z.any().optional(),
  companies: z.array(
    z.object({
      image: z.any().optional(),
      title: z.object({
        ar: z.string().min(1, { message: "الحقل مطلوب" }),
        en: z.string().min(1, { message: "Required" }),
      }),
    })
  ),
  sections: z.array(
    z.object({
      title: z.object({
        ar: z.string().min(1, { message: "الحقل مطلوب" }),
        en: z.string().min(1, { message: "Required" }),
      }),
      desc: z.object({
        ar: z.string().min(1, { message: "الحقل مطلوب" }),
        en: z.string().min(1, { message: "Required" }),
      }),
    })
  ),
  whoWeAre: z.object({
    title: z.object({
      ar: z.string().min(1, { message: "الحقل مطلوب" }),
      en: z.string().min(1, { message: "Required" }),
    }),
    desc: z.object({
      ar: z.string().min(1, { message: "الحقل مطلوب" }),
      en: z.string().min(1, { message: "Required" }),
    }),
  }),
  partners: z.object({
    title: z.object({
      ar: z.string().min(1, { message: "الحقل مطلوب" }),
      en: z.string().min(1, { message: "Required" }),
    }),
    desc: z.object({
      ar: z.string().min(1, { message: "الحقل مطلوب" }),
      en: z.string().min(1, { message: "Required" }),
    }),
    images: z.array(z.any().optional()),
  }),
});

const HomePageForm = ({ page }: { page: HomeProps }) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof HomePageSchema>>({
    defaultValues: {
      mainCover: page.mainCover || null,
      mainTitle: page.mainTitle || { ar: "", en: "" },
      mainDesc: page.mainDesc || { ar: "", en: "" },
      secondaryCover: page.secondaryCover || null,
      companies: page.companies || [{ image: null, title: { ar: "", en: "" } }],
      sections: page.sections || [
        { title: { ar: "", en: "" }, desc: { ar: "", en: "" } },
        { title: { ar: "", en: "" }, desc: { ar: "", en: "" } },
      ],
      whoWeAre: page.whoWeAre || { title: { ar: "", en: "" }, desc: { ar: "", en: "" } },
      partners: page.partners || { title: { ar: "", en: "" }, desc: { ar: "", en: "" }, images: [] },
    },
    resolver: zodResolver(HomePageSchema),
  });

  const { fields: companyFields, append: appendCompany } = useFieldArray({
    control: form.control,
    name: "companies",
  });

  const { fields: sectionFields, append: appendSection } = useFieldArray({
    control: form.control,
    name: "sections",
  });
  const { fields: partnerFields, append: appendPartner } = useFieldArray({
    control: form.control,
    name: "partners.images",
  });
  console.log(form.formState.errors);
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        // Upload mainCover if provided
        if (data.mainCover instanceof File) {
          const mainCoverUpload = await uploadImageToCloudinary(data.mainCover);
          data.mainCover = { secure_url: mainCoverUpload.secure_url, public_id: mainCoverUpload.public_id };
        }

        // Upload secondaryCover if provided
        if (data.secondaryCover instanceof File) {
          const secondaryCoverUpload = await uploadImageToCloudinary(data.secondaryCover);
          data.secondaryCover = {
            secure_url: secondaryCoverUpload.secure_url,
            public_id: secondaryCoverUpload.public_id,
          };
        }

        // Upload company images
        data.companies = await Promise.all(
          data.companies.map(async (company: any) => {
            if (company.image instanceof File) {
              const companyImageUpload = await uploadImageToCloudinary(company.image);
              company.image = { secure_url: companyImageUpload.secure_url, public_id: companyImageUpload.public_id };
            }
            return company;
          })
        );

        // Upload partner images
        data.partners.images = await Promise.all(
          data.partners.images.map(async (image: any) => {
            if (image instanceof File) {
              const partnerImageUpload = await uploadImageToCloudinary(image);
              return { secure_url: partnerImageUpload.secure_url, public_id: partnerImageUpload.public_id };
            }
            return image;
          })
        );
        const res = await updateEntity("HomePage", page._id, data);

        if (res.success) {
          toast.success("Home Page data saved successfully.");
          router.refresh();
        }
      } catch (error) {
        console.error("Error saving Home Page data:", error);
        toast.error("Error saving Home Page data. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Main Cover */}
        <FileUpload name="mainCover" label="Main Cover Image" />

        {/* Main Title and Description */}
        <ArabicEnglishForm descName={"mainDesc"} name="mainTitle" label="Main Title" />

        {/* Sections */}
        {sectionFields.map((field, index) => (
          <ArabicEnglishForm
            key={field.id}
            descName={`sections.${index}.desc`}
            name={`sections.${index}.title`}
            label={`Section ${index + 1} Title`}
          />
        ))}
        <Button disabled={isPending} onClick={() => appendSection({ title: { ar: "", en: "" }, desc: { ar: "", en: "" } })}>
          Add Section
        </Button>

        {/* Secondary Cover */}
        <FileUpload name="secondaryCover" label="Secondary Cover Image" />

        {/* Companies */}
        {companyFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-md">
            <FileUpload name={`companies.${index}.image`} label={`Company ${index + 1} Image`} />
            <ArabicEnglishForm nodesc name={`companies.${index}.title`} label={`Company ${index + 1} Title`} />
          </div>
        ))}
        <Button disabled={isPending} onClick={() => appendCompany({ image: null, title: { ar: "", en: "" } })}>Add Company</Button>

        {/* Who We Are */}
        <ArabicEnglishForm descName="whoWeAre.desc" name="whoWeAre.title" label="Who We Are Title" />

        {/* Partners */}
        <ArabicEnglishForm descName="partners.desc" name="partners.title" label="Partners Title" />
        {partnerFields.map((field, index) => (
          <FileUpload key={field.id} name={`partners.images.${index}`} label={`Partner ${index + 1} Image`} />
        ))}
        <Button disabled={isPending} onClick={() => appendPartner(null)}>Add Partner Image</Button>

        <Button disabled={isPending} type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default HomePageForm;
