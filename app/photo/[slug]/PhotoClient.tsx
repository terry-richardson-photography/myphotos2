"use client";

import { useState } from "react";
import Lightbox from "@/app/components/Lightbox";
import { urlFor } from "@/lib/image";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PasswordGate from "./PasswordGate";

export default function PhotoClient({ photo }: any) {
  const [index, setIndex] = useState<number | null>(null);
  const router = useRouter();

  const password = photo.password || "";
  const storageKey = `gallery-${photo._id}`; // ✅ FIX ADDED

  const [unlocked, setUnlocked] = useState(
    typeof window !== "undefined"
      ? sessionStorage.getItem(storageKey) === "true" || !password
      : !password
  );
console.log("PHOTO PASSWORD:", photo.password);
  const imgs = photo.images || [];

  // ✅ Safe image list
  const validImages = imgs
    .map((img: any) => {
      const src = urlFor(img)?.width(1800).quality(90).url();
      if (!src) return null;

      return {
        src,
        caption: img.caption,
      };
    })
    .filter(Boolean);

  // 🔐 PASSWORD GATE
  if (!unlocked) {
    return (
      <PasswordGate
        correctPassword={password}
        onSuccess={() => {
          sessionStorage.setItem(storageKey, "true"); // ✅ FIX USES KEY
          setUnlocked(true);
        }}
      />
    );
  }

  return (
    <main className="bg-black text-white relative">

      {/* 🔙 BACK BUTTON */}
      <div
        className="
          fixed top-6 left-6 z-50
          px-5 py-2.5
          border border-white/20
          rounded-full
          text-white/70
          hover:text-white
          hover:border-white/50
          backdrop-blur-md
          bg-white/10
          shadow-lg
          transition
          text-sm tracking-wide
        "
      >
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
      <div className="h-[70vh] flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-serif tracking-wide">
          {photo.title}
        </h1>
      </div>

      {/* GALLERY */}
      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-16">

       {validImages.map((img: any, i: number) => (
  <div
    key={i}
   className="relative overflow-hidden rounded-xl cursor-pointer group"
    onClick={() => setIndex(i)}
  >

    {/* 🔒 WATERMARK */}
   {photo.password?.length > 0 && (
  <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap items-center justify-center">
    
    {/* Dark overlay for contrast */}
    <div className="absolute inset-0 bg-black/10" />

    {Array.from({ length: 9 }).map((_, j) => (
      <span
        key={j}
        className="
          w-1/3 text-center
          text-lg md:text-2xl
          rotate-[-20deg]
          select-none
          text-white/30
          font-serif tracking-widest
        "
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

  </div>
))}

        {/* LIGHTBOX */}
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