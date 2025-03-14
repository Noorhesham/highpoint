import React from "react";
import MaxWidthWrapper from "../defaults/MaxWidthWrapper";
import Head from "../Head";
import Paragraph from "../defaults/Paragraph";

const HomeCover = ({
  image,
  mainTitle,
  mainDesc,
  children,
  className,
}: {
  image: string;
  mainTitle: string;
  mainDesc: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      style={{
        backgroundImage: `url("${image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className={` ${className || ""} h-full lg:h-[29rem] mt-10 lg:mt-16  xl:mt-18 relative`}
    >
      {" "}
      <div className=" w-full  h-full absolute inset-0  bg-black/60"></div>
      <MaxWidthWrapper className="flex relative z-30 !pt-20 flex-col gap-2 md:gap-4">
        <div className="flex flex-col gap-4 max-w-full">
          <Head className=" text-xl !lg:text-3xl !text-white" text={mainTitle} />
          <Paragraph className=" text-sm lg:text-base font-normal !max-w-full !text-white" description={mainDesc} />
          {children}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default HomeCover;
