import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
const FormInput = ({
  name,
  label,
  placeHolder,
  type,
}: {
  name: string;
  label?: string;
  placeHolder: string;
  type?: string;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type || "text"} placeholder={placeHolder || "Enter ..."} {...field} />
          </FormControl>
          <FormMessage className=" text-red-500 font-semibold" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
