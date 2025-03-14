"use client";

import { createEntity, updateEntity } from "@/app/actions/actions";
import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import GridContainer from "../defaults/GridContainer";
import { RadioGroupForm } from "../RadioGroup";
import { OperationProps } from "@/app/models/Operations";

const ApplicantSchema = z.object({
  firstName: z.string().min(1, { message: "Required" }),
  lastName: z.string().min(1, { message: "Required" }),
  title: z.string().min(1, { message: "Required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Required" }),
  company: z.string().min(1, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),
  country: z.string().min(1, { message: "Required" }),
  phone: z.string().min(1, { message: "Required" }),
  postalBox: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
  course: z.string().min(1, { message: "Required" }),
});

const ApplicantForm = ({
  applicant,
  operation,
  operations,
  course,
}: {
  applicant?: any | null;
  operation?: any;
  operations?: OperationProps[];
  course: string;
}) => {
  const t = useTranslations("ApplicantForm"); // Localization hook for translations

  const form = useForm<z.infer<typeof ApplicantSchema>>({
    defaultValues: {
      firstName: applicant?.firstName || "",
      lastName: applicant?.lastName || "",
      title: applicant?.title || "",
      email: applicant?.email || "",
      address: applicant?.address || "",
      company: applicant?.company || "",
      city: applicant?.city || "",
      country: applicant?.country || "",
      phone: applicant?.phone || "",
      postalBox: applicant?.postalBox || "",
      agreeToTerms: applicant?.agreeToTerms || false,
      course: course || applicant?.course._id.toString() || "",
    },
    resolver: zodResolver(ApplicantSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  console.log(form.formState.errors)
  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const res = applicant
          ? await updateEntity("Applicant", applicant._id, data)
          : await createEntity("Applicant", { ...data, operation });

        if (res?.success) {
          toast.success(res?.success);
          router.refresh();
          form.reset();
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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <GridContainer cols={2}>
            <FormInput name="firstName" label={t("firstName")} placeholder={t("firstNamePlaceholder")} />
            <FormInput name="lastName" label={t("lastName")} placeholder={t("lastNamePlaceholder")} />
          </GridContainer>
          <FormInput name="title" label={t("jobTitle")} placeholder={t("jobTitlePlaceholder")} />
          <FormInput name="email" label={t("email")} placeholder={t("emailPlaceholder")} type="email" />
          <FormInput name="address" label={t("address")} placeholder={t("addressPlaceholder")} />

          <GridContainer cols={2}>
            <FormInput name="company" label={t("company")} placeholder={t("companyPlaceholder")} />
            <FormInput name="city" label={t("city")} placeholder={t("cityPlaceholder")} />
          </GridContainer>

          <GridContainer cols={2}>
            <FormInput name="country" label={t("country")} placeholder={t("countryPlaceholder")} />
            <FormInput name="phone" label={t("phone")} placeholder={t("phonePlaceholder")} />
          </GridContainer>

          <FormInput name="postalBox" label={t("postalBox")} placeholder={t("postalBoxPlaceholder")} />
          {operations && operations.length > 0 && <RadioGroupForm options={operations} name="operation" />}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("agreeToTerms")} id="agreeToTerms" className="w-4 h-4" />
            <label htmlFor="agreeToTerms" className="text-sm">
              {t("agreeToTerms")}
            </label>
          </div>

          <Button disabled={isPending}>{applicant ? t("updateButton") : t("addButton")}</Button>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantForm;
