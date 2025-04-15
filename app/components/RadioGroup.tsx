"use client";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

export function RadioGroupForm({ options, name }: { options?: any; name: string }) {
  const form = useFormContext();
  const t = useTranslations();

  // State to manage the selected radio value
  const [selectedValue, setSelectedValue] = useState<string | undefined>(form.watch(name));

  // Update the selected value when radio button changes
  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    form.setValue(name, value); // Sync with react-hook-form
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{t("recipientEmail")}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handleValueChange}
              value={selectedValue}
              className="flex lg:flex-row flex-col items-start space-y-1"
            >
              {options.map((option: any, i: number) => (
                <FormItem
                  key={i}
                  className={`flex py-2 px-4 rounded-xl  border border-input cursor-pointer duration-150 items-start space-x-3 space-y-0 ${
                    selectedValue === option.title ? "bg-white" : ""
                  }`}
                >
                  <FormControl>
                    <RadioGroupItem id={option.title} value={option._id} />
                  </FormControl>
                  <FormLabel htmlFor={option.title} className="flex ">
                    <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                      <div className=" flex text-base items-center gap-2">
                        <p>{t("date")}:</p>
                        <CalendarIcon className=" w-4 h-4" />
                      </div>
                      <div className=" flex items-center gap-1">
                        <p className="text-muted-foreground">{format(option.startDate, "yyyy-MM-dd")}</p>
                        <p className="text-muted-foreground">{format(option.endDate, "yyyy-MM-dd")}</p>
                      </div>
                    </div>
                    <h2 className=" font-medium text-base">{option.city.name[locale]}</h2>{" "}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
