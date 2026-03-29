"use client";

import { useState, useEffect } from "react";
import Lightbox from "@/app/components/Lightbox";
import { urlFor } from "@/lib/image";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PasswordGate from "./PasswordGate";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PhotoClient({ photo }: any) {
  const [index, setIndex] = useState<number | null>(null);
  const router = useRouter();

  const password = photo.password || "";
  const storageKey = `gallery-${photo._id}`;

  const [unlocked, setUnlocked] = useState(!password);

  // ✅ Parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 80], [0, 120]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.6]);

  useEffect(() => {
    if (password) {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "true") setUnlocked(true);
    }
  }, [password, storageKey]);

  const imgs = photo.images || [];

  // ✅ Safe image list
  const validImages = imgs
    .map((img: any) => {
      const src = urlFor(img)?.width(1800).quality(90).url();
      if (!src) return null;

      return {
        src,
        caption: img.caption || "",
      };
    })
    .filter(Boolean);

  // 🔐 PASSWORD GATE
  if (!unlocked) {
    return (
      <PasswordGate
        correctPassword={password}
        onSuccess={() => {
          sessionStorage.setItem(storageKey, "true");
          setUnlocked(true);
        }}
      />
    );
  }

  return (
    <main className="bg-black text-white relative">

      {/* 🔙 BACK BUTTON */}
      <div className="fixed top-6 left-6 z-50 px-5 py-2.5 border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white/50 backdrop-blur-md bg-white/10 shadow-lg transition text-sm tracking-wide">
        <button
          onClick={() => {
            if (photo.categorySlug) {
              router.push(`/category/${photo.categorySlug}`);
            } else {
              router.back();
            }
          }}
        >
          ← Back to {photo.categoryTitle || "Gallery"}
        </button>
      </div>

      {/* HERO */}
      <section className="relative h-[80vh] w-full overflow-hidden">

        {photo.coverImage && (
          <motion.div
  style={{ y, opacity }}
  className="absolute inset-0"
>
            <Image
              src={urlFor(photo.coverImage).width(2000).quality(90).url()}
              alt={photo.title}
              fill
              priority
              className="object-cover scale-110"
            />
          </motion.div>
        )}

        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 space-y-6">
          <p className="text-xs uppercase tracking-widest text-white/60">
            {photo.categoryTitle}
          </p>

          <h1 className="text-4xl md:text-6xl font-serif tracking-wide">
            {photo.title}
          </h1>

          {photo.description && (
            <p className="max-w-2xl text-white/80 text-sm md:text-base leading-relaxed">
              {photo.description}
            </p>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">

        {validImages.map((img: any, i: number) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => setIndex(i)}
          >
 {/* 🔒 WATERMARK */}
{photo.watermark && (
  <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap items-center justify-center">
    
    <div className="absolute inset-0 bg-black/10" />

    {Array.from({ length: 9 }).map((_, j) => (
      <span
        key={j}
        className="w-1/3 text-center text-lg md:text-2xl rotate-[-20deg] select-none text-white/30 font-serif tracking-widest"
      >
        Terry Richardson Photography
      </span>
    ))}
    
  </div>
)}

            {/* IMAGE */}
            <Image
              src={img.src}
              alt={img.caption || photo.title}
              width={1800}
              height={1200}
              className="w-full h-auto hover:scale-[1.02] transition duration-700"
              draggable={false}
            />

            {/* 📝 CAPTION */}
            {img.caption && (
              <p className="mt-3 text-white/60 text-sm text-center">
                {img.caption}
              </p>
            )}

          </div>
        ))}

        {/* LIGHTBOX (must be OUTSIDE map) */}
        {index !== null && (
          <Lightbox
            images={validImages}
            index={index}
            setIndex={setIndex}
            onClose={() => setIndex(null)}
          />
        )}

      </div>

    </main>
  );
}