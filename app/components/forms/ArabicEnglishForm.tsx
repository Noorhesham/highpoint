import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormInput from "./FormInput";

const ArabicEnglishForm = ({ nodesc = false, name = "name" }: { nodesc?: boolean; name?: any }) => {
  console.log(name, `${name}.en `);
  return (
    <Tabs defaultValue="en" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="ar">العربية</TabsTrigger>
      </TabsList>
      <TabsContent className=" flex flex-col gap-4 mt-3" value="en">
        <FormInput label="Name" name={`${name}.en` || "name.en"} placeholder={"Name"} />
        {!nodesc && <FormInput label="Description" name="description.en" placeholder={"Description"} />}{" "}
      </TabsContent>
      <TabsContent dir="rtl" className=" flex flex-col gap-4 mt-3" value="ar">
        <FormInput label="الاسم بالعربية" name={`${name}.ar` || "name.ar"} placeholder={"Name"} />
        {!nodesc && <FormInput label=" الوصف العربي" name="description.ar" placeholder={"Description"} />}
      </TabsContent>
    </Tabs>
  );
};

export default ArabicEnglishForm;
