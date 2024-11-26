"use client";
import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const CalendarInput = ({
  control,
  name,
  label,
  disabled,
}: {
  control: any;
  name: string;
  label?: string;
  disabled?: boolean;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => {
        return (
          <FormItem className={` relative z-[60] w-full`}>
            <FormLabel className="duration-200 uppercase">{label || "Date"}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl className="">
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 flex  space-y-0  mt-0 justify-between text-left rounded-lg font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "yyyy-MM-dd") // Use "yyyy-MM-dd" format here
                    ) : (
                      <span>SELECT</span>
                    )}
                    <CalendarIcon className="ml-auto mr-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent sideOffset={-40} className="w-full  relative z-[9999] p-0" align="end">
                <Calendar
                  className=" relative z-[9999] w-full"
                  mode="single"
                  captionLayout="dropdown-buttons"
                  fromYear={1990}
                  toYear={new Date().getFullYear()}
                  selected={field.value}
                  onSelect={(date) => {
                    if (!date) return;
                    const formattedDate = format(date, "yyyy-MM-dd");
                    field.onChange(formattedDate);
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {/* <FormDescription>Your date of birth is used to calculate your age.</FormDescription> */}
          </FormItem>
        );
      }}
    />
  );
};

export default CalendarInput;
