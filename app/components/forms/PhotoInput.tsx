import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import { useFormContext } from "react-hook-form";
function getImageData(event: ChangeEvent<HTMLInputElement>) {
  // FileList is immutable, so we need to create a new one
  const dataTransfer = new DataTransfer();

  // Add newly uploaded images
  Array.from(event.target.files!).forEach((image) => dataTransfer.items.add(image));

  const files = dataTransfer.files;
  const displayUrl = URL.createObjectURL(event.target.files![0]);

  return { files, displayUrl };
}
const PhotoInput = ({ value, name, noimg }: { value: any; name: string; noimg?: boolean }) => {
  const [preview, setPreview] = useState("");
  console.log(value);
  const form = useFormContext();
  return (
    <div className="flex flex-col gap-2 items-start">
      {!noimg && (
        <div className="  w-40 h-40 mx-auto my-2 relative ">
          <Image src={preview || value || ""} fill alt="preview" className="rounded-full object-cover " />
        </div>
      )}
      <Input
        type="file"
        onChange={(event) => {
          const { files, displayUrl } = getImageData(event);
          setPreview(displayUrl);
          form.setValue(name, files[0]);
        }}
      />
    </div>
  );
};

export default PhotoInput;
