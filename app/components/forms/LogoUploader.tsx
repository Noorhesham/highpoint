"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { uploadImageToCloudinary } from "@/app/utils/fn";
import { updateGeneralConfig } from "@/app/actions/actions";
import { toast } from "react-toastify";

// Define the maximum file size (4MB)
const MAX_FILE_SIZE = 4 * 1024 * 1024;

// Define accepted image types
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for form validation
const logoFormSchema = z.object({
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than 4MB`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp files are accepted",
    })
    .optional(),
});

type LogoFormValues = z.infer<typeof logoFormSchema>;

// Function to get image data from file input
function getImageData(event: React.ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  if (event.target.files && event.target.files.length > 0) {
    Array.from(event.target.files).forEach((image) => dataTransfer.items.add(image));

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files[0]);

    return { files, displayUrl };
  }

  return { files: null, displayUrl: "" };
}

interface LogoUploadFormProps {
  defaultLogo?: string;
  onLogoChange?: (file: File) => void;
}

export function LogoUploadForm({ defaultLogo, onLogoChange }: LogoUploadFormProps) {
  const [preview, setPreview] = React.useState<string>(defaultLogo || "");

  // Initialize form with React Hook Form
  const form = useForm<LogoFormValues>({
    resolver: zodResolver(logoFormSchema),
    defaultValues: {
      logo: undefined,
    },
  });

  // Handle form submission
  async function onSubmit(data: LogoFormValues) {
    console.log(data);
    const logo = await uploadImageToCloudinary(data.logo);
    data.logo = logo.secure_url;
    console.log(logo);
    const res = await updateGeneralConfig({ logo: data.logo });
    if (res.data) {
      setPreview(logo.secure_url);
      toast.success("Logo uploaded successfully");
    }
    console.log("Form submitted:", res, data);
  }

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Organization Logo</CardTitle>
        <CardDescription>
          Upload your organization logo. This will be displayed on certificates and course materials.
        </CardDescription>
      </CardHeader>
      <Separator />
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="pt-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Logo Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-muted">
                            {preview ? (
                              <Image
                                src={preview || "/placeholder.svg"}
                                alt="Logo preview"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={(event) => {
                              const { files, displayUrl } = getImageData(event);
                              if (files && files[0]) {
                                setPreview(displayUrl);
                                onChange(files[0]);
                                if (onLogoChange) {
                                  onLogoChange(files[0]);
                                }
                              }
                            }}
                            {...rest}
                          />
                          <FormDescription>Accepted formats: JPEG, PNG, WebP. Max size: 4MB</FormDescription>
                          <FormMessage />
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setPreview("");
                  form.reset();
                }}
              >
                Reset
              </Button>
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" />
                Save Logo
              </Button>
            </CardFooter>
          </form>
        </Form>
      </FormProvider>
    </Card>
  );
}
