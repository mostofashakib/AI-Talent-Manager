import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { Zap } from "lucide-react";
import Link from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ViralVisionAI",
  description: "AI Talent Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="py-8 px-4 sm:px-6 lg:px-8 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <Zap className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">
                  ViralVisionAI
                </span>
              </Link>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
