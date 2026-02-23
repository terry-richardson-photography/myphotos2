'use client'

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { sanityClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";

type GalleryItem = {
  _key: string;
  image: any;
  caption?: string;
};

export default function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params); // ✅ unwrap params properly

  const [session, setSession] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const query = `*[_type == "photo" && slug.current == $slug][0]{
        title,
        category,
        description,
        gallery
      }`;

      const data = await sanityClient.fetch(query, { slug });

      setSession(data);
    }

    fetchSession();
  }, [slug]);

  if (!session) return <div className="p-20 text-center">Loading...</div>;

  const nextImage = () =>
    setActiveIndex((prev) =>
      prev === session.gallery.length - 1 ? 0 : (prev ?? 0) + 1
    );

  const prevImage = () =>
    setActiveIndex((prev) =>
      prev === 0 ? session.gallery.length - 1 : (prev ?? 0) - 1
    );

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      <section className="py-20 text-center">
        <h1 className="text-4xl font-serif">{session.title}</h1>
        <p className="text-neutral-500 mt-4">{session.category}</p>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          {session.gallery?.map((item: GalleryItem, index: number) => (
            <div
              key={item._key}
              className="cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={urlFor(item.image).width(1200).url()}
                alt={item.caption || ""}
                width={1200}
                height={800}
                className="object-cover w-full rounded-lg hover:opacity-90 transition"
              />
              {item.caption && (
                <p className="mt-3 text-sm text-neutral-600">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {activeIndex !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div
            className="absolute inset-0"
            onClick={() => setActiveIndex(null)}
          />

          <div className="relative max-w-6xl w-full px-4 z-10">

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ‹
            </button>

            <div className="flex flex-col items-center">
              <img
                src={urlFor(session.gallery[activeIndex].image)
                  .width(2000)
                  .url()}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />

              {session.gallery[activeIndex].caption && (
                <p className="mt-6 text-white/80 italic text-center max-w-2xl">
                  {session.gallery[activeIndex].caption}
                </p>
              )}
            </div>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ›
            </button>

            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              ✕
            </button>

          </div>
        </div>
      )}
    </main>
  );
}