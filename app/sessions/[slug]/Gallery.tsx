"use client";

import Image from "next/image";
import { urlFor } from "../../../lib/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Gallery({ session }: any) {

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No session data.
      </div>
    );
  }

  const { title, description, gallery = [] } = session;

  // SAFELY filter valid images
  const images = gallery.filter(
    (g: any) => g?.image?.asset || g?.asset
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  const minSwipeDistance = 50;

  /* lock background scroll */
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "auto";
  }, [activeIndex]);

  /* keyboard navigation */
  useEffect(() => {

    const handleKey = (e: KeyboardEvent) => {

      if (activeIndex === null) return;

      if (e.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev === images.length - 1 ? 0 : (prev ?? 0) + 1
        );
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === 0 ? images.length - 1 : (prev ?? 0) - 1
        );
      }

      if (e.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);

  }, [activeIndex, images.length]);

  /* infinite scroll loading */
  useEffect(() => {

    const onScroll = () => {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 800
      ) {
        setVisibleCount((v) => v + 24);
      }

    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);

  }, []);

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
        prev === images.length - 1 ? 0 : (prev ?? 0) + 1
      );
    }

    if (distance < -minSwipeDistance) {
      setActiveIndex((prev) =>
        prev === 0 ? images.length - 1 : (prev ?? 0) - 1
      );
    }
  };

  return (

    <div
      className="min-h-screen bg-black text-white px-6 py-20"
      onContextMenu={(e) => e.preventDefault()}
    >

      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-6">
          {title}
        </h1>

        {description && (
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        {/* MASONRY GRID */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">

          {images.slice(0, visibleCount).map((item: any, index: number) => {

            // SAFELY resolve image source
            const imageSource =
              item?.image?.asset ? item.image :
              item?.asset ? item :
              null;

            if (!imageSource) return null;

            return (

             <div
  key={item._key || index}
  className="break-inside-avoid cursor-pointer"
  style={{
    contentVisibility: "auto",
    containIntrinsicSize: "800px"
  }}
  onClick={() => setActiveIndex(index)}
>

                <Image
  src={urlFor(imageSource).width(1200).quality(70).url()}
  alt={item.alt || title}
  width={1200}
  height={800}
  loading="lazy"
  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
  className="rounded-2xl w-full h-auto mb-3 
           transition-transform duration-700 ease-out
           hover:scale-[1.03]"
/>

                {item.caption && (
                  <p className="text-white/60 text-sm tracking-wide">
                    {item.caption}
                  </p>
                )}

              </div>

            );

          })}

        </div>

      </div>

      {/* LIGHTBOX */}

      {activeIndex !== null && images[activeIndex] && (

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

              <AnimatePresence mode="wait">

                <motion.img
                  key={activeIndex}
                  src={urlFor(images[activeIndex]?.image || images[activeIndex])
                    .width(2400)
                    .quality(90)
                    .url()}
                  initial={{ x: 400, opacity: 0, scale: 0.98 }}
                  animate={{ x: 0, opacity: 1, scale: 1 }}
                  exit={{ x: -400, opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  draggable={false}
                  className="max-h-[85vh] max-w-[95vw] object-contain rounded-xl"
                />

              </AnimatePresence>

              {images[activeIndex]?.caption && (
                <p className="mt-6 text-white/70 text-sm md:text-base tracking-wide text-center max-w-2xl mx-auto">
                  {images[activeIndex].caption}
                </p>
              )}

              {/* WATERMARK */}
{/* Keyboard Hint */}
<div className="absolute bottom-4 left-4 text-white/50 text-xs tracking-widest hidden md:block">
  ← → navigate • ESC close
</div>

              <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs md:text-sm tracking-widest uppercase pointer-events-none">
                Terry Richardson Photography
              </div>

            </div>

            {/* LEFT */}
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === 0 ? images.length - 1 : (prev ?? 0) - 1
                )
              }
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 
                         w-12 h-12 items-center justify-center
                         bg-black/40 backdrop-blur-md
                         rounded-full text-white text-3xl
                         hover:bg-black/60 transition"
            >
              ‹
            </button>

            {/* RIGHT */}
            <button
              onClick={() =>
                setActiveIndex((prev) =>
                  prev === images.length - 1 ? 0 : (prev ?? 0) + 1
                )
              }
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 
                         w-12 h-12 items-center justify-center
                         bg-black/40 backdrop-blur-md
                         rounded-full text-white text-3xl
                         hover:bg-black/60 transition"
            >
              ›
            </button>

            {/* CLOSE */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              ✕
            </button>

          </div>

        </div>

      )}

    </div>

  );
}