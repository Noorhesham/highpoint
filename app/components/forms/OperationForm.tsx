"use client";
import { createEntity, deleteEntity, updateEntity } from "@/app/actions/actions";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { OperationProps } from "@/app/models/Operations";
import { Form } from "@/components/ui/form";
import FormInput from "./FormInput";
import { Button } from "@/components/ui/button";
import FormSelect from "./FormSelect";
import GridContainer from "../defaults/GridContainer";
import { useGetEntity } from "@/app/queries";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, CalendarClock, Clock, RefreshCw } from "lucide-react";

const OperationSchema = z.object({
  startDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
  city: z.string().min(1, { message: "Required" }),
  duration: z.union([z.number(), z.string().min(1)]),
  price: z.union([z.number(), z.string().min(1)]),
  course: z.string().min(1, { message: "Required" }),
  endDate: z.union([z.string().min(1, { message: "Required" }), z.date()]),
});

const formatDateForInput = (date?: Date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const OperationForm = ({
  operation,
  courseId,
  removeOperationn,
  onGenerateAll,
  isNew = false,
}: {
  operation?: OperationProps | null;
  courseId?: string;
  removeOperationn?: any;
  onGenerateAll?: (operations: any[]) => void;
  isNew?: boolean;
}) => {
  const { data: cities, isLoading } = useGetEntity({ entityName: "City", key: "city" });
  const locale = useLocale();
  const t = useTranslations();
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0 = Sunday, 1 = Monday, etc.

  const form = useForm<z.infer<typeof OperationSchema>>({
    defaultValues: {
      startDate: formatDateForInput(operation?.startDate) || new Date(),
      city: operation?.city || "",
      duration: operation?.duration || 0,
      price: operation?.price || 0,
      course: courseId,
      endDate: formatDateForInput(operation?.endDate) || new Date(),
    },
    resolver: zodResolver(OperationSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const generateRandomSerialNumber = () => {
    return `${new Date().getFullYear()}-${getRandomInt(1000, 9999)}`;
  };

  // Generate a random date that falls on the selected day of the week
  const generateDateForDayOfWeek = (dayOfWeek: number, weekOffset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();

    // Calculate days to add to reach the target day of week
    let daysToAdd = (dayOfWeek - currentDay + 7) % 7;

    // Add additional weeks based on offset
    daysToAdd += weekOffset * 7;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);

    return targetDate;
  };

  // Generate end date (5 days after start date)
  const generateEndDate = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5); // 5-day course duration
    return endDate;
  };

  // Generate a random price
  const generateRandomPrice = () => {
    return getRandomInt(500, 2000);
  };

  // Generate a single random operation
  const generateRandomOperation = (cityId: string, weekOffset: number) => {
    const startDate = generateDateForDayOfWeek(selectedDay, weekOffset);
    const endDate = generateEndDate(startDate);

    return {
      startDate: formatDateForInput(startDate),
      endDate: formatDateForInput(endDate),
      city: cityId,
      price: generateRandomPrice(),
      course: courseId,
      duration: 5, // 5 days duration
    };
  };

  // Generate operations for a full year across all cities
  const generateYearlyOperations = () => {
    if (!cities || !cities.data || !cities.data.data) {
      toast.error("No cities available");
      return [];
    }

    const availableCities = cities.data.data;
    const operations = [];

    // Generate operations for 52 weeks (1 year)
    for (let week = 0; week < 52; week++) {
      // Cycle through cities
      const cityIndex = week % availableCities.length;
      const city = availableCities[cityIndex];

      operations.push(generateRandomOperation(city._id, week));
    }

    return operations;
  };

  // Handle generate operations button click
  const handleGenerateOperations = () => {
    const operations = generateYearlyOperations();
    if (onGenerateAll && operations.length > 0) {
      onGenerateAll(operations);
    } else {
      toast.info("Generated operations preview. Use 'Submit All' to save them.");
    }
  };

  // Generate a random date for this single operation
  const generateRandomDate = () => {
    const startDate = generateDateForDayOfWeek(selectedDay);
    const endDate = generateEndDate(startDate);

    form.setValue("startDate", formatDateForInput(startDate));
    form.setValue("endDate", formatDateForInput(endDate));
    form.setValue("price", generateRandomPrice());
  };

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      try {
        const res = operation?._id
          ? await updateEntity("Operation", operation._id, data)
          : await createEntity("Operation", data);

        if (res?.success) {
          toast.success(res?.success);
          router.refresh();
        } else {
          toast.error(res?.error || "An error occurred");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("Submission failed. Please try again.");
      }
    });
  };

  const remove = () => {
    if (operation?._id) {
      startTransition(async () => {
        try {
          const res = await deleteEntity("Operation", operation._id);
          if (res?.success) {
            toast.success(res?.success);
            removeOperationn && removeOperationn();
            router.refresh();
          } else {
            toast.error(res?.error || "An error occurred");
          }
        } catch (error) {
          console.error("Error during deletion:", error);
          toast.error("Deletion failed. Please try again.");
        }
      });
    } else {
      removeOperationn && removeOperationn();
    }
  };

  const weekdays = [
    { value: 0, name: "Sunday" },
    { value: 1, name: "Monday" },
    { value: 2, name: "Tuesday" },
    { value: 3, name: "Wednesday" },
    { value: 4, name: "Thursday" },
    { value: 5, name: "Friday" },
    { value: 6, name: "Saturday" },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Random date generator section */}
          {isNew && (
            <div className="bg-gray-50 p-3 rounded-md mb-2">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {t("Random Date Generator")}
              </h3>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-gray-500 mb-1 block">{t("Start Day of Week")}</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  >
                    {weekdays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={generateRandomDate}
                >
                  <RefreshCw className="h-3 w-3" />
                  {t("Generate Random Date")}
                </Button>

                { (
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 bg-blue-600"
                    onClick={handleGenerateOperations}
                  >
                    <Calendar className="h-3 w-3" />
                    {t("Generate Year Schedule")}
                  </Button>
                )}
              </div>
            </div>
          )}

          <GridContainer cols={4}>
            <FormInput name="price" label="Price" placeholder="Price" type="number" />
            <FormInput calendar name="startDate" label="Start Date" placeholder="Start Date" type="date" />
            <FormInput calendar name="endDate" label="End Date" placeholder="End Date" type="date" />
            <FormSelect
              disabled={isLoading || !cities}
              locale={locale}
              options={
                !isLoading && cities ? cities?.data?.data.map((p: any) => ({ value: p._id, name: p.name[locale] })) : []
              }
              name="city"
              label="City"
              placeholder={t("selectCity")}
            />
          </GridContainer>

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="destructive"
              type="button"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                remove();
              }}
            >
              {t("Remove")}
            </Button>

            <Button type="submit" disabled={isPending} size="sm">
              {operation?._id ? t("Update") : t("Add")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OperationForm;
