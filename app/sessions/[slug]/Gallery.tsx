"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../lib/image";
import { useState, useEffect } from "react";

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

  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;

      if (e.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev === gallery.length - 1 ? 0 : (prev ?? 0) + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === 0 ? gallery.length - 1 : (prev ?? 0) - 1
        );
      }

      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, gallery.length]);

  // Preload adjacent images
  useEffect(() => {
    if (activeIndex === null) return;

    const nextIndex =
      activeIndex === gallery.length - 1 ? 0 : activeIndex + 1;

    const prevIndex =
      activeIndex === 0 ? gallery.length - 1 : activeIndex - 1;

    const preloadImage = (index: number) => {
      if (!gallery[index]?.image) return;
      const img = new window.Image();
      img.src = urlFor(gallery[index].image)
        .width(2400)
        .quality(90)
        .url();
    };

    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [activeIndex, gallery]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      setActiveIndex((prev) =>
        prev === gallery.length - 1 ? 0 : (prev ?? 0) + 1
      );
    }

    if (distance < -minSwipeDistance) {
      setActiveIndex((prev) =>
        prev === 0 ? gallery.length - 1 : (prev ?? 0) - 1
      );
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white px-6 py-20"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="max-w-6xl mx-auto">

        {category && (
          <div className="mb-14 pl-2 text-[10px] tracking-[0.4em] uppercase text-white/40">
            <Link href={`/category/${category}`}>
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
          onClick={() => setActiveIndex(null)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative inline-block">

              <img
                key={activeIndex}
                src={urlFor(gallery[activeIndex].image)
                  .width(2400)
                  .quality(90)
                  .url()}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl animate-fade-zoom"
              />

              <div className="absolute bottom-4 right-4 text-white text-xs md:text-sm tracking-widest uppercase opacity-40 pointer-events-none drop-shadow-md">
                Terry Richardson Photography
              </div>
            </div>

            {gallery[activeIndex].caption && (
              <p className="mt-6 text-white/70 text-sm md:text-base tracking-wide">
                {gallery[activeIndex].caption}
              </p>
            )}

            {/* Desktop arrows */}
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? gallery.length - 1 : (prev ?? 0) - 1
                )
              }
              className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === gallery.length - 1 ? 0 : (prev ?? 0) + 1
                )
              }
              className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
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