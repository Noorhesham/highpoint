import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { unstable_setRequestLocale } from "next-intl/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/nav/SideBar";

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  return (
    <div>
      <SidebarProvider>
        <GridContainer cols={12} className=" relative min-h-screen w-screen pt-32">
          <MaxWidthWrapper noPadding className=" pl-10  col-span-2">
            <AppSidebar />
          </MaxWidthWrapper>
          <div className=" col-span-10">
            <SidebarTrigger />
            {children}
          </div>
        </GridContainer>
      </SidebarProvider>
    </div>
  );
}
