'use client'

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
    async function fetchSession() {
      const query = `*[_type == "photo" && slug.current == "${slug}"][0]{
        title,
        description,
        "gallery": gallery[]{
          "image": image,
          caption
        }
      }`;

      const data = await sanityClient.fetch(query);
      setSession(data);
    }

    fetchSession();
  }, [slug]);

  if (!session) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-serif text-center mb-6">
        {session.title}
      </h1>

      {/* IMAGE GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {session.gallery?.map((item: any, index: number) => {
          if (!item?.image) return null;

          return (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={urlFor(item.image).width(1600).url()}
                alt={item.caption || session.title}
                width={1600}
                height={1000}
                className="rounded-xl w-full h-auto hover:opacity-90 transition"
              />
            </div>
          );
        })}
      </div>
 {activeIndex !== null &&
  session?.gallery &&
  session.gallery[activeIndex] &&
  session.gallery[activeIndex].image && (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">

      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={() => setActiveIndex(null)}
      />

      <div className="relative max-w-7xl w-full px-6 z-10">

        {/* LEFT */}
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev === 0
                ? session.gallery.length - 1
                : (prev ?? 0) - 1
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl transition"
        >
          ‹
        </button>

        {/* IMAGE */}
        <img
          src={urlFor(session.gallery[activeIndex].image)
            .width(2400)
            .url()}
          className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
        />

        {/* CAPTION */}
        {session.gallery[activeIndex].caption && (
          <p className="mt-8 text-center text-white/70 tracking-wide text-sm uppercase">
            {session.gallery[activeIndex].caption}
          </p>
        )}

        {/* RIGHT */}
        <button
          onClick={() =>
            setActiveIndex((prev) =>
              prev === session.gallery.length - 1
                ? 0
                : (prev ?? 0) + 1
            )
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-5xl transition"
        >
          ›
        </button>

        {/* CLOSE */}
        <button
          onClick={() => setActiveIndex(null)}
          className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl transition"
        >
          ✕
        </button>

      </div>
    </div>
      )}

    </main>
  );
}
