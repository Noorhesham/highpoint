import Login from "@/app/components/forms/LoginForm";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  await unstable_setRequestLocale(locale);
  return (
    <div className=" h-screen w-full flex justify-center items-center ">
      <Login />
    </div>
  );
};

export default page;
