import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/layout-wrapper";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  title: "Athletic Barf",
  description: "App de ventas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
