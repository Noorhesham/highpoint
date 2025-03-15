"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createEntity, updateEntity } from "@/app/actions/actions";
import FormInput from "@/app/components/forms/FormInput";
import bcrypt from "bcryptjs";
const UserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.password && !user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required",
        path: ["password"],
      });
    }
  });

type UserFormProps = {
  user?: User;
};

const UserForm = ({ user }: UserFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    startTransition(async () => {
      try {
        const hashedPassword = await bcrypt.hash(values.password, 10);
        const data = { ...values, password: hashedPassword };
        const res = user ? await updateEntity("User", user._id, data) : await createEntity("User", data);
        console.log(res)
        if (res.success) {
          toast.success(res.success);
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch (error) {
        toast.error("Error saving user");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput name="name" label="Full Name" control={form.control} placeholder="John Doe" />

        <FormInput name="email" label="Email" control={form.control} placeholder="john@example.com" type="email" />

        <FormInput
          name="password"
          label="Password"
          control={form.control}
          placeholder="••••••"
          type="password"
          description={user ? "Leave blank to keep current password" : undefined}
        />

        <Button type="submit" disabled={isPending}>
          {user ? "Update User" : "Create User"}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
