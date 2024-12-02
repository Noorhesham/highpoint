import Footer from "@/app/components/Footer";

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
    <div>
      {children}
      <Footer />
    </div>
  );
}
