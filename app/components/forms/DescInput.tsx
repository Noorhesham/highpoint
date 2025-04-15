import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import FormInput from "./FormInput";

const DescInput = ({ label, name }: { label?: string; name: string }) => {
  return (
    <Tabs defaultValue="en" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="ar">العربية</TabsTrigger>
      </TabsList>
      <TabsContent className=" flex flex-col gap-4 mt-3" value="en">
        <div className="flex items-center gap-2 w-full">
          <FormInput textarea label={label || "Name"} name={`${name}.en` || "name.en"} placeholder={"Name"} />
        </div>
      </TabsContent>
      <TabsContent dir="rtl" className=" flex flex-col gap-4 mt-3" value="ar">
        <div className="flex items-center gap-2 w-full">
          <FormInput textarea label="الاسم بالعربية" name={`${name}.ar` || "name.ar"} placeholder={"Name"} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DescInput;
