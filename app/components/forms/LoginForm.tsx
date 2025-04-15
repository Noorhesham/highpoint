"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomForm from "./CustomForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});
const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = React.useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log(res);
      if (res?.ok) router.push("/dashboard/category");
      if (res?.error) setServerError(res.error);
    });
  };
  const loginArray = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];
  return (
    <section className="max-w-lg m-auto border border-input rounded-2xl  justify-center px-5 py-10 flex flex-1 flex-col items-center">
      <div className="mx-auto flex flex-col items-center justify-center gap-2 w-full">
        <h1 className="text-center text-xl md:text-2xl  font-bold">Login</h1>
        <div className="w-full  px-5 lg:px-14 gap-2 flex flex-col">
          <CustomForm
            serverError={serverError}
            btnText="LOGIN"
            isPending={isPending}
            form={form}
            inputs={loginArray}
            btnStyles=" w-full"
            onSubmit={onSubmit}
          />
        </div>
        {serverError && <p className="text-red-500 text-center mt-3 text-sm font-semibold">{serverError}</p>}
      </div>
    </section>
  );
};

export default Login;
