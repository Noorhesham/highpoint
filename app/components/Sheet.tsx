import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SubCategoryForm from "./forms/SubCategoryForm";
import { useEffect, useState } from "react";
import { SubCategoryType } from "./forms/CategoriesForm";
import { CategoryProps } from "../models/Category";

export function SheetData({ itemParent }: { itemParent: CategoryProps }) {
  const [subCategoriesState, setSubCategoriesState] = useState<Array<SubCategoryType>>(itemParent.subCategories || []);
  const [submit, setSubmit] = useState();
  useEffect(() => {
    setSubCategoriesState(itemParent.subCategories);
  }, [submit]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Show SubCategories</Button>
      </SheetTrigger>
      <SheetContent className="!max-w-[40%] !overflow-scroll">
        <SheetHeader>
          <SheetTitle>This is the sub categories</SheetTitle>
          {/* <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription> */}
        </SheetHeader>
        {subCategoriesState.map((item, index) => (
          <SubCategoryForm
            className="flex-col"
            parentCategory={itemParent._id}
            index={index}
            onSucess={() => setSubmit((s) => !s)}
            stateSetter={setSubCategoriesState}
            defaultValue={item}
            key={index}
          />
        ))}{" "}
        <Button
          type="button"
          className="my-3 w-fit"
          onClick={() => setSubCategoriesState([...subCategoriesState, { name: { ar: "", en: "" } }])}
        >
          Add Sub Category
        </Button>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
