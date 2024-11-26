import React, { ReactNode, useTransition } from "react";
import FormInput from "./FormInput";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import BabySpinner from "../BabySpinner";

export interface CustomFormProps {
  src?: string;
  serverError?: string[] | string | null;
  title?: string;
  noimg?: boolean;
  text?: string;
  onSubmit?: any;
  id?: string;
  form: any;
  titles?: string[];
  isPending?: boolean;
  localSubmit?: any;
  children?: ReactNode;
  btnText?: string;
  link?: string;
  linkText?: string;
  disabled?: boolean;
  btnStyles?: string;
  cancel?: any;
  inputs: any;
}
const CustomForm = ({ inputs, title, form, onSubmit, children, isPending }: CustomFormProps) => {
  return (
    <Form {...form}>
      <form className="flex w-full  h-full items-stretch gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-1 gap-2 flex-col">
          {title && <h1>{title}</h1>}
          <div className="flex pt-4 flex-col gap-2">
            {inputs.map((input: any) => (
              <FormInput phone={input.phone || false} key={input.name} {...input} />
            ))}
          </div>
          {children}
          <Button className=" mt-auto" disabled={isPending}>
            {isPending ? <BabySpinner /> : "Submit "}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomForm;
