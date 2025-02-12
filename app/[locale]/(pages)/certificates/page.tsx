import { getEntities } from "@/app/actions/actions";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import Head from "@/app/components/Head";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";
export const dynamic = "force-dynamic";
const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const { data: page } = await getEntities("Page", 1, {}, true, "", "", "", {}, { slug: "certificates" });
  const { sections } = page?.data[0];
  console.log(sections);
  return (
    <main>
      <HomeCover
        className="!h-80"
        image={sections[0].image.secure_url}
        mainTitle={sections[0].title[locale]}
        mainDesc={sections[0].desc[locale]}
      />{" "}
      <MaxWidthWrapper>
        <GridContainer cols={4}>
          {sections.slice(1).map((section, index) => (
            <div key={index} className={`flex items-center gap-2  flex-col `}>
              {" "}
              <div className="w-20 aspect-square relative h-20">
                <Image src={section.image?.secure_url} className="object-contain" alt="course image" fill />
              </div>
              <div className="flex w-full items-center flex-col gap-4">
                <Head text={section.title[locale]} className="!text-base !text-main font-bold" />
                <Paragraph className="text-gray-800 !text-sm" size="sm" description={section.desc[locale]} />
              </div>
            </div>
          ))}
        </GridContainer>
      </MaxWidthWrapper>
    </main>
  );
};

export default page;
