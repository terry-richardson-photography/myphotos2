import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terry Richardson Photography",
  description: "Personal archive & commercial photography",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {/* GLOBAL NAVIGATION */}
        <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/10">

          {/* Brand */}
          <Link
            href="/"
            className="text-sm tracking-[0.25em] uppercase font-medium text-white"
          >
            Terry Richardson
          </Link>

          {/* Navigation */}
         <div className="flex gap-8 text-[11px] tracking-[0.25em] uppercase text-white">
            <Link href="/" className="hover:text-white transition duration-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-white transition duration-300">
              About
            </Link>
          </div>

        </header>

        {children}

      </body>
    </html>
  );
}