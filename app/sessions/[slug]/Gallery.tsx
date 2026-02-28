"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../lib/image";
import { useState } from "react";

export default function Gallery({ session }: any) {
  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No session data.
      </div>
    );
  }

  const { title, description, category, gallery = [] } = session;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <main
      className="min-h-screen bg-black text-white px-6 py-20 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-6xl mx-auto">

        {category && (
          <div className="mb-14 pl-2 text-[10px] tracking-[0.4em] uppercase text-white/40">
            <Link
              href={`/category/${category}`}
              className="hover:text-white/80 transition"
            >
              ← {category}
            </Link>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-6">
          {title}
        </h1>

        {description && (
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {gallery.map((item: any, index: number) => (
            <div
              key={item._key || index}
              className="cursor-pointer"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={urlFor(item.image).width(1600).quality(75).url()}
                alt={item.alt || title || ""}
                width={1600}
                height={1000}
                draggable={false}
                className="rounded-2xl w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null && gallery[activeIndex] && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="relative">

            <img
              src={urlFor(gallery[activeIndex].image)
                .width(2400)
                .quality(90)
                .url()}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
            />

            {/* WATERMARK */}
            <div className="absolute bottom-4 right-4 text-white text-xs md:text-sm tracking-widest uppercase opacity-60 pointer-events-none">
  Terry Richardson Photography
</div>

            {/* CLOSE BUTTON */}
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