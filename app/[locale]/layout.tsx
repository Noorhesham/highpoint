import type { Metadata } from "next";
import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Cairo, Bitter } from "next/font/google";
import NavBar from "../components/nav/NavBar";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import QueryProvider from "@/lib/QueryProvider";
import AuthProvider from "@/lib/SessionProvider";
import "@/app/models";

import { LoadingProvider } from "../constant/LoadingContext";
const cairo = Cairo({ subsets: ["latin"], weight: ["400", "600", "700", "200", "300", "500"] });
const bitter = Bitter({ subsets: ["latin"], weight: ["400", "600", "700", "200", "300", "500"] });

const locales = ["en", "ar"];
export const metadata = {
  title: "Highpoint - Elevate Your Learning Experience",
  description:
    "Discover top courses, expert instructors, and personalized learning experiences with Highpoint. Explore courses by category, city, and skill level.",
  keywords: ["Highpoint", "online courses", "education", "e-learning", "skill development", "learning platform"],
  openGraph: {
    title: "Highpoint - Elevate Your Learning Experience",
    description: "Discover top courses, expert instructors, and personalized learning experiences with Highpoint.",
    url: "https://highpointtc.com",
    siteName: "Highpoint",
    images: [
      {
        url: "/logo_pzbpnl.jpg",
        width: 1200,
        height: 630,
        alt: "Highpoint Homepage",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Highpoint - Elevate Your Learning Experience",
    description: "Discover top courses, expert instructors, and personalized learning experiences with Highpoint.",
    images: ["/logo_pzbpnl.jpg"],
  },
  alternates: {
    canonical: "https://highpointtc.com/",
    languages: {
      "en-US": "https://highpointtc.com/en",
      ar: "https://highpointtc.com/ar",
    },
  },
};

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
        className={locale === "en" ? bitter.className : cairo.className}
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
            <LoadingProvider>
              <NextIntlClientProvider messages={messages}>
                <main className="">
                  <NavBar />
                  {children}
                </main>
              </NextIntlClientProvider>
            </LoadingProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
