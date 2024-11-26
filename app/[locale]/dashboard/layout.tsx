import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import SideBar from "@/app/components/nav/SideBar";
import SideNav from "@/app/components/nav/SideNav";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  return (
    <MaxWidthWrapper>
      <GridContainer cols={12} className=" pt-32">
        <div className=" col-span-2">
          <SideBar />
        </div>
        <div className=" col-span-10">{children}</div>
      </GridContainer>
    </MaxWidthWrapper>
  );
}
