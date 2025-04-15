import GridContainer from "@/app/components/defaults/GridContainer";
import MaxWidthWrapper from "@/app/components/defaults/MaxWidthWrapper";
import { unstable_setRequestLocale } from "next-intl/server";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/components/nav/SideBar";
import connect from "@/lib/clientPromise";
export const dynamic = "force-dynamic";
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);
  await connect();
  return locale === "en" ? (
    <main className=" w-full pt-32">
      <SidebarProvider>
        <AppSidebar />
        <section className=" w-full">
          <SidebarTrigger />
          {children}
        </section>
      </SidebarProvider>
    </main>
  ) : (
    <main className=" w-full pt-32">
      <SidebarProvider>
        <section className=" w-full">
          <SidebarTrigger />
          {children}
        </section>
        <AppSidebar />
      </SidebarProvider>
    </main>
  );
}
