import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import Head from "@/app/components/Head";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, CodeIcon, Heading1, Laptop, Timer } from "lucide-react";
import { unstable_setRequestLocale } from "next-intl/server";
import Image from "next/image";
import React from "react";
import { FaMoneyBill } from "react-icons/fa";
import { GrDocumentDownload } from "react-icons/gr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import List from "@/app/components/LIst";
import MiniHeading from "@/app/components/MiniHeading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FlexWrapper from "@/app/components/defaults/FlexWrapper";
import { getEntity } from "@/app/actions/actions";

const page = async ({ params: { locale, id } }: { params: { locale: string; id: string } }) => {
  unstable_setRequestLocale(locale);
  const course = await getEntity("Course", id, "", ["operations", "city", "category"]);
  console.log(course.data);
  return (
    <section className=" pt-32">
      <div
        style={{
          backgroundImage: "url(/leadership_1661813502.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className=" relativeh-[30rem]"
      >
        <FlexWrapper className=" flex items-center justify-between ">
          <div className=" px-8 py-4  items-end flex flex-col gap-2 right-10">
            <h1 className=" font-semibold text-3xl text-white">دورة LPC- باور بي آي Power BI</h1>
            <div className=" flex items-center gap-2 ">
              <Button className="  text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                متوفر ايضا اونلاين
              </Button>
              <Button className=" text-gray-50 bg-main hover:bg-main/50 duration-150" size={"sm"}>
                الإدارة والقيادة{" "}
              </Button>
            </div>
          </div>
          <div className="flex   flex-col 0 font-medium ">
            <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>
            <div className=" bg-white rounded-b-xl ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-1">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-1">
                  <p>المدة :</p>
                  <Timer />
                </div>
                <p className=" text-muted-foreground">1 أسبوع</p>
              </div>
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-1">
                  <p>الرسوم :</p>
                  <FaMoneyBill />
                </div>
                <p className=" text-muted-foreground">4,350</p>
              </div>
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-1">
                  <p>النوع :</p>
                  <Laptop />
                </div>
                <p className=" text-muted-foreground">في الغرفة الصفية</p>
              </div>
              <div className="flex  px-4 py-1 gap-2 flex-col ">
                <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                  سجل الان
                </Button>
                <Button className=" text-gray-50 bg-main hover:bg-main/50 duration-150" size={"sm"}>
                  ابق علي تواصل
                </Button>
                <Button className=" text-gray-50 bg-red-500 hover:bg-red-400 duration-150" size={"sm"}>
                  تنزيل النشرة
                </Button>
              </div>
            </div>
          </div>
        </FlexWrapper>
      </div>

      <MaxWidthWrapper>
        <div className=" gap-4 grid md:grid-cols-2 grid-cols-1">
          <div>
            <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
          </div>
          <div>
            <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
            <div className=" flex items-center justify-between py-2 ">
              <div className="flex  px-4 py-1 gap-2 items-center justify-between ">
                <div className=" flex items-center gap-2">
                  <p>التاريخ:</p>
                  <CalendarIcon />
                </div>
                <p className=" text-muted-foreground">Sep-30-2024</p>
              </div>
              <h2 className=" font-medium text-xl">باريس</h2>{" "}
              <Button className=" text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                سجل الان
              </Button>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
      <MaxWidthWrapper>
        <GridContainer className=" gap-4" cols={5}>
          <div className="text-black  col-span-3">
            <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>

            <Tabs defaultValue="account" className=" w-full">
              <TabsList className=" w-full flex gap-4 bg-transparent py-2 px-4">
                <TabsTrigger value="account">مقدمة</TabsTrigger>
                <TabsTrigger value="password">أهداف</TabsTrigger>
                <TabsTrigger value="password">من ينبغي ان يحضر</TabsTrigger>
                <TabsTrigger value="password"> مدينة الدورة</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Paragraph
                  className="text-black "
                  description="باور بي آي Power BI عبارة عن مجموعة من منتجات وخدمات ذكاء الأعمال (BI) وإعداد التقارير وتصور البيانات للأفراد والفرق. يتميز باور بي آي Power BI بإمكانيات النشر والتوزيع المبسطة، فضلاً عن التكامل مع منتجات وخدمات Microsoft الأخرى."
                />
                <Paragraph
                  className="text-black "
                  description=" تساعدك دورة LPC- باور بي آي Power BI على بدء استخدام Power BI، وهي مجموعة أدوات قوية لتحليل الأعمال قد تساعدك بفاعلية أكبر في إنشاء ومشاركة تصورات مؤثرة مع الآخرين في مؤسستك."
                />
                <Paragraph
                  className="text-black "
                  description="في هذه الدورة التدريبية ستتعلم كيفية استيراد البيانات وإنشاء تصورات وترتيب تلك التصورات في تقارير، وستتمكن من تثبيت المرئيات على لوحات المعلومات للمشاركة، بالإضافة إلى كيفية طرح أسئلة حول بياناتك باستخدام Power BI Q&A."
                />
              </TabsContent>
              <TabsContent value="account">
                <h2 className=" text-black font-semibold">في نهاية دورة LPC- باور بي آي Power BI ستكون قادراً على:</h2>
                <ul>
                  <li>إنشاء تقارير ذكاء الأعمال بجودة احترافية من الألف إلى الياء.</li>
                  <li>مزج وتحويل البيانات الأولية إلى لوحات معلومات تفاعلية جميلة.</li>
                  <li>تصميم وتنفيذ نفس أدوات ذكاء الأعمال التي يستخدمها المحللون المحترفون وعلماء البيانات.</li>
                </ul>
              </TabsContent>
              <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>
            <div>
              <MiniHeading title="مخطط الدورة" />
              <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">معلومات عن الدورة</h1>
              <div className=" px-8 py-4">
                <div className="">
                  <Tabs defaultValue="day1" className=" w-full">
                    <TabsList className=" w-full flex gap-4 bg-transparent py-2 px-4">
                      <TabsTrigger
                        className=" py-2 px-4 bg-amber-500 hover:bg-amber-400 duration-150 rounded-full  text-white font-semibold"
                        value="day1"
                      >
                        يوم 1
                      </TabsTrigger>
                      <TabsTrigger
                        className=" py-2 px-4 bg-amber-500 hover:bg-amber-400 duration-150 rounded-full  text-white font-semibold"
                        value="day2"
                      >
                        يوم 2
                      </TabsTrigger>
                      <TabsTrigger
                        className=" py-2 px-4 bg-amber-500 hover:bg-amber-400 duration-150 rounded-full  text-white font-semibold"
                        value="day3"
                      >
                        يوم 3
                      </TabsTrigger>
                      <TabsTrigger
                        className=" py-2 px-4 bg-amber-500 hover:bg-amber-400 duration-150 rounded-full  text-white font-semibold"
                        value="day4"
                      >
                        يوم 4
                      </TabsTrigger>
                      <TabsTrigger
                        className=" py-2 px-4 bg-amber-500 hover:bg-amber-400 duration-150 rounded-full  text-white font-semibold"
                        value="day5"
                      >
                        يوم 5
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="day1">
                      <List
                        title="مفاهيم باور بي آي Power BI"
                        list={[
                          "الاطلاع على خدمة باور بي آي Power BI.",
                          "مصادر بيانات باور بي آي Power BI.",
                          "إنشاء ملفات بيانات قابلة للتحديث.",
                          "تحميل ملف CSV.",
                        ]}
                      />
                    </TabsContent>

                    <TabsContent value="day2">
                      <List
                        title="مفاهيم باور بي آي Power BI"
                        list={[
                          "انشاء تقرير جديد.",
                          "انشاء وترتيب التصورات.",
                          "تنسيق التصور.",
                          "انشاء تصور مخطط.",
                          "استخدام النص والخريطة والتصورات.",
                          "استخدام أداة تقطيع لتصفية التصورات.",
                          "تنزيل واستخدام التصورات المخصصة من المعرض.",
                        ]}
                      />
                    </TabsContent>

                    <TabsContent value="day3">
                      <List
                        title="دارة صفحات التقرير"
                        list={[
                          "اضافة عامل تصفية إلى صفحة أو تقرير.",
                          "تعيين تفاعلات التصورات.",
                          "طباعة صفحة تقرير.",
                          "إنشاء لوحات المعلومات وإدارتها.",
                          "تثبيت عنوان تقرير مباشر بلوحة معلومات.",
                          "بناء لوحة المعلومات للحصول على رؤى سريعة.",
                        ]}
                      />
                    </TabsContent>

                    <TabsContent value="day4">
                      <List
                        title="دارة صفحات التقرير"
                        list={[
                          "اضافة عامل تصفية إلى صفحة أو تقرير.",
                          "تعيين تفاعلات التصورات.",
                          "طباعة صفحة تقرير.",
                          "إنشاء لوحات المعلومات وإدارتها.",
                          "تثبيت عنوان تقرير مباشر بلوحة معلومات.",
                          "بناء لوحة المعلومات للحصول على رؤى سريعة.",
                        ]}
                      />
                    </TabsContent>

                    <TabsContent value="day5">
                      <List
                        title="دارة صفحات التقرير"
                        list={[
                          "اضافة عامل تصفية إلى صفحة أو تقرير.",
                          "تعيين تفاعلات التصورات.",
                          "طباعة صفحة تقرير.",
                          "إنشاء لوحات المعلومات وإدارتها.",
                          "تثبيت عنوان تقرير مباشر بلوحة معلومات.",
                          "بناء لوحة المعلومات للحصول على رؤى سريعة.",
                        ]}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>{" "}
            </div>
          </div>
          <div className=" col-span-2 flex flex-col gap-2">
            <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main ">ابحث عن الدورة</h1>
            <div className=" flex-col flex gap-3 px-3 py-1.5 border-input border ">
              <Input placeholder="ادخل الكلمات المفتاحية" />
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Button className="  w-full  text-gray-50 bg-yellow-500 hover:bg-yellow-400 duration-150" size={"sm"}>
                ابحث
              </Button>
            </div>
            <div>
              <h1 className=" rounded-t-xl text-white px-4 py-2 bg-main "> الدورات المتعلقه </h1>
            </div>
          </div>
        </GridContainer>
      </MaxWidthWrapper>
      <MaxWidthWrapper className=" text-gray-800">
        <GridContainer className=" gap-5" cols={5}>
          <div className=" col-span-3">
            <Head className=" text-black mb-4" text="The Complete Python Course From Zero To Hero" />
            <Paragraph
              className=" text-gray-900 text-muted-foreground"
              description="Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!"
            />
            <GridContainer cols={2}>
              <div className=" flex items-center gap-4">
                <CheckIcon className=" text-green-400" />
                <Paragraph
                  className=" text-gray-800"
                  size="sm"
                  description="You will master the Python programming language by building 100 unique projects over 100 days."
                />
              </div>
              <div className=" flex items-center gap-4">
                <CheckIcon className=" text-green-400" />
                <Paragraph
                  className=" text-gray-800"
                  size="sm"
                  description="You will learn automation, game, app and web development, data science and machine learning all using Python."
                />
              </div>
              <div className=" flex items-center gap-4">
                <CheckIcon className=" text-green-400" />
                <Paragraph
                  className=" text-gray-800"
                  size="sm"
                  description="You will be able to program in Python professionally"
                />
              </div>
              <div className=" flex items-center gap-4">
                <CheckIcon className=" text-green-400" />
                <Paragraph
                  className=" text-gray-800"
                  size="sm"
                  description="You will learn Selenium, Beautiful Soup, Request, Flask, Pandas, NumPy, Scikit Learn, Plotly, and Matplotlib."
                />
              </div>
            </GridContainer>
            <div className=" flex items-center gap-2">
              <Button>Enroll Now</Button>
              <Button>See Details</Button>
            </div>
          </div>
          <div className=" relative col-span-2">
            <Image className=" object-contain" src={"/2776760_f176_10.jpg"} alt="Python" fill />
          </div>
        </GridContainer>
      </MaxWidthWrapper>
      <MaxWidthWrapper className=" flex flex-col gap-5">
        <Head text="This course includes" className=" text-black" />
        <GridContainer cols={5}>
          <GridContainer className=" col-span-3" cols={2}>
            <div className=" text-gray-900 flex items-center gap-4">
              <CodeIcon />
              <span>52 hours on-demand video</span>
            </div>
            <div className=" text-gray-900 flex items-center gap-4">
              <GrDocumentDownload />
              <span>147 downloadable resources</span>
            </div>
            <div className=" text-gray-900 flex items-center gap-4">
              <CodeIcon />
              <span>52 hours on-demand video</span>
            </div>
            <div className=" text-gray-900 flex items-center gap-4">
              <GrDocumentDownload />
              <span>147 downloadable resources</span>
            </div>
            <div className=" text-gray-900 flex items-center gap-4">
              <CodeIcon />
              <span>52 hours on-demand video</span>
            </div>
            <div className=" text-gray-900 flex items-center gap-4">
              <GrDocumentDownload />
              <span>147 downloadable resources</span>
            </div>
          </GridContainer>
          <GridContainer cols={4} className=" flex flex-wrap col-span-2">
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
            <div className=" py-2 px-4 bg-blue-300 rounded-2xl border border-input ">In Japan</div>
          </GridContainer>
        </GridContainer>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
