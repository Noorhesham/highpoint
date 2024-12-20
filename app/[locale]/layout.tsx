import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Cairo } from "next/font/google";
import NavBar from "../components/nav/NavBar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import QueryProvider from "@/lib/QueryProvider";
import AuthProvider from "@/lib/SessionProvider";
const inter = Cairo({ subsets: ["latin"], weight: ["400", "600", "700", "200", "300", "500"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};
const locales = ["en", "ar"];
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  unstable_setRequestLocale(locale);
  console.log(locale);
  return (
    <html lang={locale}>
      <body
        dir={locale === "ar" ? "rtl" : "ltr"}
        style={{ textAlign: locale === "ar" ? "right" : "left", direction: locale === "ar" ? "rtl" : "ltr" }}
        className={inter.className}
      >
        <AuthProvider>
          {" "}
          <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover={false}
            theme="light"
          />
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <main className="">
                <NavBar />
                {children}
              </main>
            </NextIntlClientProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
