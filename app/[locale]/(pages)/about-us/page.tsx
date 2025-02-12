import { GridBackgroundDemo } from "@/app/components/BackGrid";
import GridContainer from "@/app/components/defaults/GridContainer";
import Paragraph from "@/app/components/defaults/Paragraph";
import Head from "@/app/components/Head";
import { MessageCircleIcon, MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";
import AboutCard from "@/app/components/AboutCard";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GrEmoji } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEntities } from "@/app/actions/actions";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import Image from "next/image";
export const dynamic = "force-dynamic";

const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();
  const { data: page } = await getEntities(
    "Page",
    1,
    { slug: "about-us " },
    true,
    "",
    "",
    "",
    {},
    { slug: "about-us " }
  );
  const { sections } = page?.data[0];
  console.log(sections);
  return (
    <section className="flex flex-col gap-4">
      <HomeCover
        className="!h-80"
        image={sections[0].image.secure_url}
        mainTitle={sections[0].title[locale]}
        mainDesc={sections[0].desc[locale]}
      />
      {sections.slice(1).map((section, index) => (
        <MaxWidthWrapper
          key={index}
          className={`flex items-center gap-5  flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`} // Reverse on odd indices
        >
          <div className="flex w-full items-start flex-col gap-4">
            <Head text={section.title[locale]} className="!text-3xl !text-main font-bold" />
            <Paragraph className="text-gray-800" size="lg" description={section.desc[locale]} />
          </div>
          <div className="w-full relative h-64">
            <Image src={section.image.secure_url} className="object-cover" alt="course image" fill />
          </div>
        </MaxWidthWrapper>
      ))}
    </section>
  );
};

export default page;
{
  /* <GridBackgroundDemo>
<div className="flex items-center flex-col gap-4">
  <Head text={t("contact.headline")} className="text-7xl font-bold" />
  <Paragraph className=" text-gray-800" size="lg" description={t("contact.subText")} />
  <MaxWidthWrapper>
    <GridContainer cols={4}>
      {cards.map((card, index) => (
        <AboutCard
          key={index}
          icon={card.icon}
          title={card.title}
          description={card.description}
          link={card.link}
        />
      ))}
    </GridContainer>
  </MaxWidthWrapper>
</div>
</GridBackgroundDemo> */
}
