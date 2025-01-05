"use client";
import { createEntity, updateEntity } from "@/app/actions/actions";
import React from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import GridContainer from "../defaults/GridContainer";
import FormSelect from "./FormSelect";

const ApplicantSchema = z.object({
  course: z.string().min(1, { message: "Required" }),
  fullName: z.string().min(1, { message: "Required" }),
  title: z.string().min(1, { message: "Required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Required" }),
  jobTitle: z.string().optional(),
  city: z.string().min(1, { message: "Required" }),
  country: z.string().min(1, { message: "Required" }),
  phone: z.string().min(1, { message: "Required" }),
  fax: z.string().optional(),
  mobilePhone: z.string().optional(),
  paymentMethod: z.string().min(1, { message: "Required" }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
  additionalNotes: z.string().optional(),
});

const ApplicantForm = ({ applicant, course }: { applicant?: any | null; course?: any }) => {
  const form = useForm<z.infer<typeof ApplicantSchema>>({
    defaultValues: {
      course: course || applicant?.course || "",
      fullName: applicant?.fullName || "",
      email: applicant?.email || "",
      address: applicant?.address || "",
      city: applicant?.city || "",
      country: applicant?.country || "",
      phone: applicant?.phone || "",
      fax: applicant?.fax || "",
      mobilePhone: applicant?.mobilePhone || "",
      paymentMethod: applicant?.paymentMethod || "",
      agreeToTerms: applicant?.agreeToTerms || false,
      additionalNotes: applicant?.additionalNotes || "",
    },
    resolver: zodResolver(ApplicantSchema),
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const res = applicant
          ? await updateEntity("Applicant", applicant._id, data)
          : await createEntity("Applicant", data);

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
  console.log(form.formState.errors);
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
          <GridContainer cols={2}>
            <FormInput name="fullName" label="Full Name" placeholder="Enter full name" />
          </GridContainer>
          <FormInput name="email" label="Email" placeholder="Enter email address" type="email" />
          <FormInput name="address" label="Address" placeholder="Enter address" />
    
          <GridContainer cols={2}>
            <FormInput name="city" label="City" placeholder="Enter city" />
            <FormInput name="country" label="Country" placeholder="Enter country" />
          </GridContainer>
          <GridContainer cols={2}>
            <FormInput name="phone" label="Phone" placeholder="Enter phone number" />
            <FormInput name="fax" label="Fax" placeholder="Enter fax number" />
          </GridContainer>
          <FormInput name="mobilePhone" label="Mobile Phone" placeholder="Enter mobile phone number" />
          <FormSelect
            name="paymentMethod"
            label="Payment Method"
            placeholder="Select Payment Method"
            options={[
              { value: "Personal", name: "Personal" },
              { value: "Company", name: "Company" },
            ]}
          />
          <FormInput
            name="additionalNotes"
            label="Additional Notes"
            placeholder="Enter any additional notes"
            textarea
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" {...form.register("agreeToTerms")} id="agreeToTerms" className="w-4 h-4" />
            <label htmlFor="agreeToTerms" className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>
          <Button disabled={isPending}>{applicant ? "Update" : "Add"} Applicant</Button>
        </form>
      </Form>
    </div>
  );
};

export default ApplicantForm;
