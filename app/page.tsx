'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "../lib/sanity";
import { urlFor } from "../lib/image";

type Session = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  gallery: {
    image: any;
    caption?: string;
  }[];
};

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
  if (!slug) return;

  async function fetchSession() {
    const query = `*[_type == "photo" && slug.current == $slug][0]{
      title,
      description,
      category,
      "gallery": gallery[]{
        "image": image,
        caption
      }
    }`;

    const data = await sanityClient.fetch(query, { slug });
    setSession(data);
  }

  fetchSession();
}, [slug]);

  const categories = [
    "Family",
    "Travel",
    "Landscape",
    "Portrait",
    "Commercial",
  ];

  return (
  <main className="min-h-screen bg-white text-neutral-900">

    {/* SPLIT NAVIGATION */}
    <div className="max-w-7xl mx-auto px-6 py-10 flex justify-between items-center">

      {/* Brand */}
      <Link
        href="/"
        className="text-sm tracking-[0.25em] uppercase font-medium text-neutral-700 hover:text-black transition"
      >
        Terry Richardson
      </Link>

      {/* Contact */}
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 border border-neutral-300 px-5 py-2 rounded-full text-xs tracking-widest uppercase text-neutral-600 hover:text-black hover:border-black transition duration-300"
      >
        Contact
        <span className="text-lg">→</span>
      </Link>

    </div>

    {/* HERO */}
    <section className="pb-16 text-center px-6">
      <h1 className="text-5xl md:text-6xl font-serif tracking-tight">
        Photography Portfolio
      </h1>
    </section>

    {/* CATEGORY GRID */}
    <section className="px-6 pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

        {categories.map((category) => {

          const session = sessions.find(
            (s) => s.category === category
          );

          if (!session?.gallery?.[0]?.image) return null;

          return (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
            >
              <div className="group cursor-pointer">

                <Image
                  src={urlFor(session.gallery[0].image)
                    .width(1200)
                    .url()}
                  alt={category}
                  width={1200}
                  height={800}
                  className="rounded-2xl object-cover h-72 w-full group-hover:opacity-90 transition duration-500"
                />

                <h2 className="mt-6 text-xl font-serif text-center tracking-wide">
                  {category}
                </h2>

              </div>
            </Link>
          );
        })}

      </div>
    </section>

  </main>
);
}