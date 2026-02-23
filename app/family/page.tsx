'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { sanityClient } from "../../lib/sanity";
import { urlFor } from "../../lib/image";

type Photo = {
  _id: string;
  title?: string;
  image?: any;
  category?: string;
};

export default function HomePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    async function fetchPhotos() {
      const query =
        selectedCategory === "All"
          ? `*[_type == "photo"] | order(_createdAt desc)`
          : `*[_type == "photo" && category == "${selectedCategory}"] | order(_createdAt desc)`;

      const data = await sanityClient.fetch(query);
      setPhotos(data);
    }

    fetchPhotos();
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

      {/* CATEGORY FILTER */}
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

      {/* PHOTO GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {photos.map((photo) => {
            if (!photo.image) return null;

            const imageUrl = urlFor(photo.image).width(1200).url();

            return (
              <div key={photo._id} className="overflow-hidden rounded-2xl shadow-md">
                <Image
                  src={imageUrl}
                  alt={photo.title || "Photography image"}
                  width={1200}
                  height={800}
                  className="object-cover w-full h-80 hover:scale-105 transition duration-500"
                />
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}