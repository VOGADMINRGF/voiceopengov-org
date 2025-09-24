import type { ReactNode } from "react";
import Header from "@/components/shell/Header";
import Footer from "@/components/shell/Footer";

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
