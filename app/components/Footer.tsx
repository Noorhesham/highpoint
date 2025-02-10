import React from "react";
import GridContainer from "./defaults/GridContainer";
import { BoxIcon, LocateIcon, PhoneIcon } from "lucide-react";
import MaxWidthWrapper from "./defaults/MaxWidthWrapper";
import { MdEmail } from "react-icons/md";
import NumberFooter from "./NumberFooter";

const Footer = () => {
  return (
    <MaxWidthWrapper>
      <GridContainer cols={4}>
        <div className=" border-l border-input pl-2 flex flex-col  gap-6">
          <h1 className=" font-semibold text-black text-lg mb-2 border-b border-input pb-2">Dubai</h1>
        </div>

        <div className=" border-l border-input pl-2 flex flex-col  gap-6">
          <h1 className=" font-semibold text-black text-lg mb-2 border-b border-input pb-2">Abu Dhabi</h1>
        </div>
        <div className=" border-l border-input pl-2 flex flex-col  gap-6">
          <h1 className=" font-semibold text-black text-lg mb-2 border-b border-input pb-2">Riyadh</h1>
        </div>

        <div className=" border-l border-input pl-2 flex flex-col  gap-6">
          <h1 className=" font-semibold text-black text-lg mb-2 border-b border-input pb-2">Jeddah</h1>
        </div>
        <div className=" flex flex-col">
          <div dir="left" className="flex ltr  !text-left items-center gap-2">
            <PhoneIcon className="w-5 h-5" />

            <NumberFooter />
          </div>
        </div>
        <div className="flex text-left items-center gap-2">
          <MdEmail className="w-5 h-5" />
          <a href="mailto:info@highpointtc.com">info@highpointtc.com</a>
        </div>
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default Footer;
