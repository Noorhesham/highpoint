import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
const FormInput = ({
  name,
  label,
  placeholder,
  type,
}: {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className=" flex items-start flex-col">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input type={type || "text"} placeholder={placeholder || "Enter ..."} {...field} />
          </FormControl>
          <FormMessage className=" text-red-500 font-semibold" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
