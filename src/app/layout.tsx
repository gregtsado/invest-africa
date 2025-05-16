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
    <html lang="en">
      <body
        className={`${workSans.variable} ${inter.className} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
