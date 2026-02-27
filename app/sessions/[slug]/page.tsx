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
  const [inputPassword, setInputPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchSession() {
      const query = `*[_type == "photo" && slug.current == $slug][0]{
        title,
        description,
        category,
        password,
        "gallery": gallery[]{
          "image": image,
          caption
        }
      }`;

      const data = await sanityClient.fetch(query, { slug });
      setSession(data);

      if (!data?.password) {
        setAuthorized(true);
      }
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

  // 🔐 PASSWORD GATE
  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md w-full">
          <h1 className="text-3xl font-serif mb-6">Private Session</h1>

          <input
            type="password"
            placeholder="Enter password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            className="w-full bg-black border border-white/20 px-4 py-3 rounded-lg text-center text-white outline-none focus:border-white"
          />

          <button
            onClick={() => {
              if (inputPassword.trim() === session.password?.trim()) {
                setAuthorized(true);
              } else {
                alert("Incorrect password");
              }
            }}
            className="mt-6 w-full border border-white/30 px-6 py-3 rounded-lg text-xs tracking-widest uppercase hover:bg-white hover:text-black transition"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // ✅ SESSION VIEW
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Back to Category */}
        <div className="mb-14 pl-2 text-[10px] tracking-[0.4em] uppercase text-white/40">
          <Link
            href={`/category/${session.category?.toLowerCase()}`}
            className="hover:text-white/80 transition"
          >
            ← {session.category}
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-6">
          {session.title}
        </h1>

        {session.description && (
          <p className="text-center text-white/60 mb-16 max-w-2xl mx-auto">
            {session.description}
          </p>
        )}

        {/* IMAGE GRID */}
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
                  className="rounded-2xl w-full h-auto group-hover:opacity-90 transition"
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

            <div
              className="absolute inset-0 bg-black/95"
              onClick={() => setActiveIndex(null)}
            />

            <div className="relative max-w-7xl w-full px-6 z-10">

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

              <img
                src={urlFor(session.gallery[activeIndex].image)
                  .width(2400)
                  .url()}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />

              {session.gallery[activeIndex].caption && (
                <p className="mt-8 text-center text-white/60 text-sm uppercase tracking-widest">
                  {session.gallery[activeIndex].caption}
                </p>
              )}

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