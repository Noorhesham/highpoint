"use client";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
  onChange,
}: {
  control: any;
  name: string;
  label?: string;
  disabled?: boolean;
  onChange?: any;
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false); // Control popover state

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => {
        return (
          <FormItem className="relative w-full">
            <FormLabel className="duration-200 uppercase">{label || "Date"}</FormLabel>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 flex space-y-0 mt-0 justify-between text-left rounded-lg font-normal",
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
              <PopoverContent
                onClick={(e) => e.stopPropagation()} // Prevents the dialog from closing
                sideOffset={-40}
                className="w-full z-[51] relative p-0"
                align="end"
              >
                <Calendar
                  className="relative w-full"
                  mode="single"
                  captionLayout="dropdown-buttons"
                  fromYear={1990}
                  toYear={new Date().getFullYear()}
                  selected={field.value}
                  onSelect={(date) => {
                    if (!date) return;
                    if (onChange) return onChange(date);
                    field.onChange(date);
                    setPopoverOpen(false); // Close the popover after selection
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        );
      }}
    />
  );
};

export default CalendarInput;
