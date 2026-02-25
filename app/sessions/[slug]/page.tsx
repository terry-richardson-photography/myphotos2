'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { sanityClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";

export default function SessionPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [session, setSession] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-16 text-[11px] tracking-[0.25em] uppercase text-white/40">
          <Link
            href={`/category/${session.category?.toLowerCase()}`}
            className="hover:text-white transition"
          >
            ← {session.category}
          </Link>

          <Link
            href="/"
            className="hover:text-white transition"
          >
            Home →
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-6 tracking-tight">
          {session.title}
        </h1>

        {/* Description */}
        {session.description && (
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto leading-relaxed">
            {session.description}
          </p>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {session.gallery?.map((item: any, index: number) => {
            if (!item?.image) return null;

            return (
              <div
                key={index}
                className="cursor-pointer group"
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={urlFor(item.image).width(1600).url()}
                  alt={item.caption || session.title}
                  width={1600}
                  height={1000}
                  className="rounded-2xl w-full h-auto transition duration-500 group-hover:opacity-90"
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null &&
        session.gallery?.[activeIndex]?.image && (
          <div className="fixed inset-0 bg-black flex items-center justify-center z-50">

            {/* Background overlay */}
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              onClick={() => setActiveIndex(null)}
            />

            <div className="relative max-w-7xl w-full px-6 z-10">

              {/* Left Arrow */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === 0
                      ? session.gallery.length - 1
                      : (prev ?? 0) - 1
                  )
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl"
              >
                ‹
              </button>

              {/* Image */}
              <img
                src={urlFor(session.gallery[activeIndex].image)
                  .width(2400)
                  .url()}
                className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              />

              {/* Caption */}
              {session.gallery[activeIndex].caption && (
                <p className="mt-8 text-center text-white/60 text-sm uppercase tracking-widest">
                  {session.gallery[activeIndex].caption}
                </p>
              )}

              {/* Right Arrow */}
              <button
                onClick={() =>
                  setActiveIndex((prev) =>
                    prev === session.gallery.length - 1
                      ? 0
                      : (prev ?? 0) + 1
                  )
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-5xl"
              >
                ›
              </button>

              {/* Close */}
              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white text-3xl"
              >
                ✕
              </button>

            </div>
          </div>
        )}

    </main>
  );
}