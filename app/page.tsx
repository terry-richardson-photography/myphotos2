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
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function fetchSessions() {

      const query =
        selectedCategory === "All"
          ? `*[_type == "photo"] | order(_createdAt desc){
              _id,
              title,
              slug,
              category,
              gallery
            }`
          : `*[_type == "photo" && category == "${selectedCategory}"] | order(_createdAt desc){
              _id,
              title,
              slug,
              category,
              gallery
            }`;

      const data = await sanityClient.fetch(query);

      console.log("SANITY RAW:", data);

      setSessions(data);
    }

    fetchSessions();
  }, [selectedCategory]);

  const categories = [
    "All",
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

      {/* FILTER BUTTONS */}
      <section className="px-6 pb-12 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full border transition ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* SESSION GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {sessions.map((session) => {
            if (!session.gallery?.[0]?.image) return null;

            const imageUrl = urlFor(session.gallery[0].image)
              .width(1200)
              .url();

            return (
              <Link
                key={session._id}
                href={`/sessions/${session.slug.current}`}
                className="block overflow-hidden rounded-2xl shadow-md"
              >
                <Image
                  src={imageUrl}
                  alt={session.title}
                  width={1200}
                  height={800}
                  className="object-cover w-full h-80 hover:scale-105 transition duration-500"
                />
                <div className="p-4 bg-white">
                  <h3 className="font-serif text-lg">
                    {session.title}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {session.category}
                  </p>
                </div>
              </Link>
            );
          })}

        </div>
      </section>

    </main>
  );
}