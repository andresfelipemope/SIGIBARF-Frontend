import { Bricolage_Grotesque, Modak } from 'next/font/google';
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-body',
});

const modak = Modak({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-title',
});

export const metadata = {
  title: "Athletic Barf",
  description: "App de ventas",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${modak.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        <Navbar/>
        <main className="flex-1">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
