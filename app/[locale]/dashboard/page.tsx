import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { LogoUploadForm } from "@/app/components/forms/LogoUploader";
import GeneralConfig from "@/app/models/mainSettings";
import React from "react";

const page = async () => {
  const defaultData = await GeneralConfig.findOne({});
  console.log(defaultData)
  return (
    <MaxWidthWrapper>
      <GridContainer cols={3}>
        <LogoUploadForm defaultLogo={defaultData?.logo} />
      </GridContainer>
    </MaxWidthWrapper>
  );
};

export default page;
