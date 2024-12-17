import React, { Suspense, useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import CalendarInput from "./CalendarInput";
import RichText from "./RichText";
export interface CalendarProps {
  control: any;
  name: string;
  label?: string;
}
type CalendarComponentType = React.ComponentType<CalendarProps>;

const FormInput = ({
  name,
  label,
  placeholder,
  type,
  textarea,
  calendar,
}: {
  name: string;
  label?: string;
  placeholder: string;
  type?: string;
  calendar?: boolean;
  textarea?: boolean;
}) => {
  const form = useFormContext();
  const [CalendarComponent, setCalendarComponent] = useState<CalendarComponentType>();
  useEffect(() => {
    if (calendar) {
      const loadCalendar = async () => {
        const { default: CalendarInput } = await import("./CalendarInput");
        //@ts-ignore
        setCalendarComponent(() => CalendarInput);
      };
      loadCalendar();
    }
  }, [calendar]);
  if (calendar && CalendarComponent)
    return (
      <Suspense>
        <div className=" relative w-full">
          <CalendarComponent label={label} name={name || ""} control={form.control} />
        </div>
      </Suspense>
    );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className=" flex  w-full items-start flex-col">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {textarea ? (
              <RichText description={field.value} onChange={field.onChange} />
            ) : (
              <Input type={type || "text"} placeholder={placeholder || "Enter ..."} {...field} />
            )}
          </FormControl>
          <FormMessage className=" text-red-500 font-semibold" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
