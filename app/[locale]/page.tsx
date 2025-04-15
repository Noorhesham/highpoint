import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import Head from "../components/Head";
import Paragraph from "../components/defaults/Paragraph";
import MaxWidthWrapper from "../components/defaults/MaxWidthWrapper";
import { LeafyGreenIcon, SearchIcon, BookOpenIcon, GlobeIcon } from "lucide-react";
import FlexWrapper from "../components/defaults/FlexWrapper";
import SwiperCards from "../components/SwiperCards";
import FeatureCard from "../components/FeatureCard";
import GridContainer from "../components/defaults/GridContainer";
import { Button } from "@/components/ui/button";
import { GrUserExpert } from "react-icons/gr";
import { AiOutlineSolution } from "react-icons/ai";
import { FaInnosoft } from "react-icons/fa";
import { GiFlexibleLamp } from "react-icons/gi";
import { AppleCardsCarouselDemo } from "../components/CardsCarousel";
import { cn } from "@/lib/utils";
import Footer from "../components/Footer";
import { getEntities } from "../actions/actions";
import SearchBox from "../components/SearchBox";
import Image from "next/image";
import { CategoryProps } from "../models/Category";
import Link from "next/link";
import Tabing from "../components/Tabing";
import HomeCover from "../components/ui-visual/HomeCover";
import CourseCard from "../components/CourseCard";
import { CourseProps } from "../models/Course";
import ProductCard from "../components/Product";
import MotionItem from "../components/defaults/MotionItem";
import ChooseCourse from "../components/ChooseCourse";

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations();

  const features = [
    {
      Icon: LeafyGreenIcon,
      title: t("featureAboutUsTitle"),
      description: t("featureAboutUsDescription"),
    },
    {
      Icon: BookOpenIcon,
      title: t("featureCoursesTitle"),
      description: t("featureCoursesDescription"),
    },
    {
      Icon: GlobeIcon,
      title: t("featureGlobalReachTitle"),
      description: t("featureGlobalReachDescription"),
    },
  ];
  const page = await getEntities("HomePage", 1, {});
  const categories = await getEntities("Category", 1, {}, false, "", "", "", { name: 1 }, {});
  const courses = await getEntities("Course", 1, { status: "published" }, false, "", "", "", { name: 1 }, {}, 8);
  const cities = await getEntities("City", 1, {}, false, "", "", "", { name: 1 }, {});
  const { mainCover, mainTitle, mainDesc, secondaryCover, companies, sections, whoWeAre, partners } =
    page.data.data[0] || {};
  console.log(page.data.data[0], cities.data.data);
  return (
    <section className=" pt-5">
      <HomeCover image={"/hero.jpg"} mainTitle={mainTitle[locale]} mainDesc={mainDesc[locale]}>
        <div className=" py-4 px-4 lg:px-8 bg-main/60 rounded-2xl flex-col flex w-full">
          {" "}
          <SearchBox />
          <ChooseCourse />
        </div>
      </HomeCover>
      <div className=" bg-gray-200">
        <MaxWidthWrapper className=" items-center py-10 flex flex-col gap-3">
          <Head className="  text-xl !lg:text-2xl" text={sections[0].title[locale]} />
          <Paragraph className="text-center" maxWidth description={sections[0].desc[locale]} />
          <GridContainer motion cols={4}>
            {categories.data?.data.map((category: CategoryProps) => (
              <MotionItem key={category._id}>
                <Link href={`/${locale}/courses?category=${category._id}`}>
                  <div className=" rounded-2xl overflow-hidden w-full h-32 relative">
                    <h2 className=" absolute z-30 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {category.name[locale]}
                    </h2>
                    <div className=" w-full  h-full absolute inset-0  z-20 bg-black/60"></div>
                    <Image src={category?.mainImage[0]?.secure_url} alt="" fill className=" object-cover" />
                  </div>
                </Link>
              </MotionItem>
            ))}
          </GridContainer>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper className=" items-start py-10 flex flex-col gap-3">
        <Head className=" !text-2xl" text={sections[1].title[locale]} />
        <Paragraph className="text-start" maxWidth description={sections[1].desc[locale]} />
        <Tabing
          defaultValue=""
          options={categories.data?.data.map((category: CategoryProps) => {
            return {
              label: category.name[locale],
              href: category._id,
              content: (
                <GridContainer cols={4}>
                  {category.subCategories.map((subCategory: any) => (
                    <Link
                      className=" rounded-2xl overflow-hidden w-full py-3 shadow-sm px-6 border-gray-400 border relative"
                      href={`/${locale}/courses?category=${subCategory._id}`}
                      key={subCategory._id}
                    >
                      <div className="">
                        <h2 className=" text-black text-sm ">
                          {subCategory.name[locale].length > 20
                            ? subCategory.name[locale].slice(0, 20) + "..."
                            : subCategory.name[locale]}
                        </h2>
                      </div>
                    </Link>
                  ))}
                </GridContainer>
              ),
            };
          })}
        />
      </MaxWidthWrapper>
      <div className=" bg-gray-200">
        <MaxWidthWrapper className=" items-center py-10 flex flex-col gap-3">
          <Head className=" !text-2xl" text={t("cityTitle")} />
          <Paragraph className="text-center" maxWidth description={t("cityDesc")} />
          <GridContainer motion cols={4}>
            {cities.data?.data.map((category: CategoryProps) => (
              <MotionItem key={category._id}>
                <Link href={`/${locale}/courses?city=${category._id}`}>
                  <div className=" rounded-2xl overflow-hidden w-full h-32 relative">
                    <h2 className=" absolute z-30 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {category.name[locale]}
                    </h2>
                    <div className=" w-full  h-full absolute inset-0  z-20 bg-black/60"></div>
                    <Image src={category?.image?.secure_url} alt="" fill className=" object-cover" />
                  </div>
                </Link>
              </MotionItem>
            ))}
          </GridContainer>
          <Button className=" mt-5">
            <Link href={`/${locale}/places`}>{t("viewAllcities")}</Link>
          </Button>
        </MaxWidthWrapper>
      </div>
      <MaxWidthWrapper>
        <div className="flex bg-main  justify-between lg:flex-row flex-col items-center gap-2">
          <div
            style={{
              backgroundImage: `url("${secondaryCover.secure_url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className=" flex w-full  items-center h-[70vh] flex-col gap-2 relative"
          >
            <div className=" w-full h-full absolute inset-0  bg-black/60 " />
            <div className=" z-20 relative  max-w-lg self-center my-auto flex flex-col items-center">
              <Head className=" text-white text-center !text-2xl" text={sections?.[2]?.title[locale]} />
              <Paragraph maxWidth className=" text-center text-gray-100" description={sections?.[2]?.desc[locale]} />
            </div>
          </div>
          <MaxWidthWrapper>
            <GridContainer cols={3} className=" w-full h-full">
              {companies.map((company: any, index) => (
                <div key={index} className="  bg-white py-2 px-4 flex flex-col  items-center">
                  <div className="w-20 h-20 relative">
                    <Image src={company.image.secure_url} alt="" fill className=" object-contain" />
                  </div>
                  <h2 className=" text-muted-foreground text-gray-700">{company.title[locale]}</h2>
                </div>
              ))}
            </GridContainer>
          </MaxWidthWrapper>
        </div>

        <GridContainer className=" mt-5" cols={3}>
          {features.map((feature, index) => (
            <FeatureCard key={index} Icon={feature.Icon} title={feature.title} description={feature.description} />
          ))}
        </GridContainer>
        {/* <div className=" grid md:grid-cols-2 grid-cols-1 gap-5 py-10" cols={2}>
          <div className="flex flex-col gap-4">
            <Head className=" text-black" text={t("valuePropositionTitle")} />
            <Paragraph className=" text-gray-700" description={t("valuePropositionText")} />
            <Button className=" w-[30%]"> {t("continue")}</Button>
          </div>
          <div>
            <FeatureCard
              Icon={GrUserExpert}
              title={t("features.expertInstructors")}
              description={t("features.expertInstructorsdesc")}
            />

            <FeatureCard
              Icon={AiOutlineSolution}
              title={t("features.customSolutions")}
              description={t("features.customSolutionsdesc")}
            />

            <FeatureCard
              Icon={FaInnosoft}
              title={t("features.innovativeLearning")}
              description={t("features.innovativeLearningdesc")}
            />

            <FeatureCard
              Icon={GiFlexibleLamp}
              title={t("features.flexibleDelivery")}
              description={t("features.flexibleDeliverydesc")}
            />
            <FeatureCard
              Icon={LeafyGreenIcon}
              title={t("features.resultsOriented")}
              description={t("features.resultsOrienteddesc")}
            />
          </div>
        </div> */}
      </MaxWidthWrapper>
      {/*courses*/}
      <div className=" bg-main">
        <MaxWidthWrapper>
          <Head className=" text-white  !text-2xl" text={"الدورات الأكثر طلبا بين الطلاب"} />
          <Paragraph className=" text-white text-center" maxWidth description={""} />
          <SwiperCards
            autoplay
            className=" mt-6 h-96"
            items={courses.data?.data.map((course: CourseProps, i: number) => {
              return {
                card: (
                  <div key={course._id} className=" h-full bg-white">
                    <ProductCard product={course} index={i} />
                  </div>
                ),
              };
            })}
          />
        </MaxWidthWrapper>
      </div>

      {/* <MaxWidthWrapper noPadding>
        <AppleCardsCarouselDemo />
      </MaxWidthWrapper> */}

      <div
        className=" flex items-center justify-center"
        style={{
          backgroundImage: "url(/bg-meirc-numbers.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <MaxWidthWrapper className={cn(" flex   mr-auto", locale === "ar" ? " justify-end" : "")}>
          <div className=" self-end w-fit">
            <Head className=" text-black" text={t("valuePropositionTitle")} />
            <Paragraph className=" text-gray-700" description={t("valuePropositionText")} />
            <GridContainer className=" max-w-2xl mt-4" cols={3}>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
              <div className="  px-4 py-2 bg-white shadow-md">
                <h1 className=" font-semibold  ">65+</h1>
                <p>Years of Experience</p>
              </div>
            </GridContainer>
          </div>
        </MaxWidthWrapper> */}
      </div>
      <MaxWidthWrapper>
        {" "}
        <GridContainer className=" !grid-cols-1 lg:!grid-cols-2" cols={2}>
          <div>
            {partners.title[locale] && <Head className=" !text-2xl" text={partners.title[locale]} />}
            {partners.desc[locale] && <Paragraph maxWidth description={partners.desc[locale]} />}
          </div>
          <div>
            <GridContainer cols={5}>
              {partners.images.map((image: any, index: number) => (
                <div className=" w-full relative h-24" key={index}>
                  <Image src={image.secure_url} className=" object-contain" alt="partner" fill />
                </div>
              ))}
            </GridContainer>
          </div>
        </GridContainer>
      </MaxWidthWrapper>

      <div
        style={{
          backgroundImage: `url("${secondaryCover.secure_url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className=" flex w-full  items-center h-[55vh] flex-col gap-2 relative"
      >
        {" "}
        <div className=" w-full h-full absolute inset-0  bg-black/60 " />
        <MaxWidthWrapper>
          <GridContainer className=" !grid-cols-1 lg:!grid-cols-2" cols={2}>
            <div className=" z-20 relative  max-w-lg self-center my-auto flex flex-col items-center">
              <Head className=" text-white !text-2xl" text={whoWeAre?.title[locale]} />
              <Paragraph maxWidth className=" text-center text-gray-100" description={whoWeAre?.desc[locale]} />
            </div>
          </GridContainer>
        </MaxWidthWrapper>
      </div>
      <Footer />
    </section>
  );
}
