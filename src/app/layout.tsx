import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Africa Invest - Investment Opportunities",
  description: "Discover and invest in African opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">      <body
        className={`${workSans.variable} ${inter.className} antialiased min-h-screen bg-[#0A0A0A] text-white`}
      >
        <Providers>
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3B82F6,transparent)]" />
          </div>
          <Header />
          <main className="container mx-auto px-4 py-8 animate-in relative">
            <div className="absolute top-[-400px] right-[-200px] -z-10">
              <div className="relative w-[800px] h-[800px] [background:radial-gradient(circle_at_center,#3B82F6,transparent_50%)] opacity-20 blur-2xl" />
            </div>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
