"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Lightbox({
  images,
  index,
  setIndex,
  onClose,
}: {
  images: { src: string; caption?: string }[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const current = images[index];
  if (!current?.src) return null;

  const prev = () =>
    setIndex((index - 1 + images.length) % images.length);

  const next = () =>
    setIndex((index + 1) % images.length);

  // 👉 Direction tracking
  const prevIndex = useRef(index);
  const direction = index > prevIndex.current ? 1 : -1;
  prevIndex.current = index;

  // ⌨️ Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index]);

  // ⚡ Preload
  useEffect(() => {
    const nextIndex = (index + 1) % images.length;
    const img = new window.Image();
    img.src = images[nextIndex].src;
  }, [index, images]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}

        // 📱 Swipe
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 100) prev();
          if (info.offset.x < -100) next();
        }}
      >

        {/* IMAGE */}
      
      <motion.div
  key={index}
  className="relative max-w-6xl w-full px-6 text-center"
  initial={{ opacity: 0, x: direction * 40 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: direction * -40 }}
  transition={{ duration: 0.45, ease: "easeInOut" }}
  onClick={(e) => e.stopPropagation()}
>

  {/* 🔢 IMAGE COUNTER */}
  <div
    className="
      absolute top-6 left-1/2 -translate-x-1/2 z-50
      px-3 py-1
      bg-black/40 backdrop-blur-md
      rounded-full
      text-white/80 text-xs tracking-wider
    "
  >
    {index + 1} / {images.length}
  </div>

  <Image
    src={current.src}
    alt=""
    width={1600}
    height={1000}
    className="w-full h-auto rounded-lg"
  />

  {current.caption && (
    <p className="mt-4 text-white/70 text-sm">
      {current.caption}
    </p>
  )}
</motion.div>

        {/* ← LEFT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 text-white text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ‹
        </button>

        {/* → RIGHT */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 text-white text-4xl bg-black/40 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ›
        </button>

        {/* ✕ CLOSE */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-10 right-6 z-50 text-white text-2xl"
        >
          ✕
        </button>

      </motion.div>
    </AnimatePresence>
  );
}