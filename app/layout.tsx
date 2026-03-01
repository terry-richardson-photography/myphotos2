import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Protection from "./Protection";
import Link from "next/link";

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
      <body className="bg-black text-white select-none">
        <Protection />

        {/* Header */}
        <header className="w-full border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

            <Link
              href="/"
              className="text-sm tracking-[0.3em] uppercase"
            >
              Terry Richardson
            </Link>

            <nav className="flex gap-10 text-xs tracking-[0.3em] uppercase text-white/70">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </nav>

          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}