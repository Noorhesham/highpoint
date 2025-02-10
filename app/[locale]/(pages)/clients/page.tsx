import ChooseCourse from "@/app/components/ChooseCourse";
import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import Paragraph from "@/app/components/defaults/Paragraph";
import FormSelect from "@/app/components/forms/FormSelect";
import HomeCover from "@/app/components/ui-visual/HomeCover";
import React from "react";

const page = () => {
  return (
    <main>
      <HomeCover image="/banner-testimonials.jpg" mainTitle="Clients" mainDesc="" />
      <MaxWidthWrapper>
        <GridContainer cols={8}>
          <div className="col-span-5">
            <Paragraph
              description="ما هي تعليقات المشاركين عن دورات هاي بونيت التدريبية؟
آراء عملائنا تتحدث عن نفسها!

قدّمت هاي بونيت دورات تدريبية لآلاف العاملين في مختلف المجالات و الصناعات في القطاعين الحكومي و الخاص في جميع أنحاء العالم، و نتلقى بشكل مستمر تعليقات رائعة و متميزة حول ما نقدمه من دورات تتسم بالجودة العالية و مراعاة أحدث المعايير في التدريب. مُبين أدناه بعض التعليقات التي تلقيناها من المشاركين في دوراتنا التدريبية.

 الآراء التالية مقتبسة من تعليقات حقيقية قدّمها المشاركون في الدورات التدريبية السابقة، و يتم تحديثها بشكل دائم عند إتمام كل دورة تدريبية. نسعى جاهدين وراء النجاح و دائماً ما نجدُ تشجيعاً فيما نتلقاه من تعليقاتٍ إيجابية ومحفزة على المُضي نحو الأفضل. شارك في فاعليات هاي بونيت بحضور إحدى دوراتنا التدريبية.

إذا لم تكونوا قد إلتحقتم بدورةٍ تدريبيةٍ بعد، يمكنكم الإتصال بنا و ستسرنا خدمتكم. لمزيدٍ من المعلومات، اضغط هنا."
            />
          </div>
          <div className=" bg-gray-400 col-span-3">
            <ChooseCourse/>
          </div>
        </GridContainer>
      </MaxWidthWrapper>
    </main>
  );
};

export default page;
