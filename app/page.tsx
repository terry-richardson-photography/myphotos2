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
    async function fetchSessions() {
      const query = `*[_type == "photo"] | order(_createdAt desc){
        _id,
        title,
        slug,
        category,
        "gallery": gallery[]{
          "image": image,
          caption
        }
      }`;

      const data = await sanityClient.fetch(query);
      setSessions(data);
    }

    fetchSessions();
  }, []);

  const categories = [
    "Family",
    "Travel",
    "Landscape",
    "Portrait",
    "Commercial",
  ];

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* HERO */}
      <section className="py-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-serif tracking-tight">
          Terry Richardson Photography
        </h1>
      </section>

      {/* CATEGORY GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

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

                  <h2 className="mt-6 text-2xl font-serif text-center tracking-wide">
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