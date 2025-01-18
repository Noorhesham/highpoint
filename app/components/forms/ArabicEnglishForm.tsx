import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormInput from "./FormInput";
import { ReactNode } from "react";
import FlexWrapper from "../defaults/FlexWrapper";

const ArabicEnglishForm = ({
  nodesc = false,
  name = "name",
  children,
  label,
  descName = "description",
  noName = false,
  labeldESC,
}: {
  nodesc?: boolean;
  name?: any;
  children?: ReactNode;
  label?: string;
  descName?: string;
  noName?: boolean;
  labeldESC?: string;
}) => {
  console.log(name, `${name}.en `);
  return (
    <Tabs defaultValue="en" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="ar">العربية</TabsTrigger>
      </TabsList>
      <TabsContent className=" flex flex-col gap-4 mt-3" value="en">
        <div className="flex items-center gap-2 w-full">
          {!noName && <FormInput label={label || "Name"} name={`${name}.en` || "name.en"} placeholder={"Name"} />}
          {children}
        </div>
        {!nodesc && (
          <FormInput
            textarea
            label={labeldESC || "Description"}
            name={`${descName}.en` || "name.en"}
            placeholder={"Description"}
          />
        )}{" "}
      </TabsContent>
      <TabsContent dir="rtl" className=" flex flex-col gap-4 mt-3" value="ar">
        <div className="flex items-center gap-2 w-full">
          {!noName && <FormInput label="الاسم بالعربية" name={`${name}.ar` || "name.ar"} placeholder={"Name"} />}{" "}
          {children}
        </div>
        {!nodesc && (
          <FormInput
            textarea
            label={labeldESC || " الوصف العربي"}
            name={`${descName}.ar` || "desc.ar"}
            placeholder={"Description"}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ArabicEnglishForm;
