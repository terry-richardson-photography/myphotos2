'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";

type Session = {
  title: string;
  slug: string;
  gallery: {
    image: any;
    caption?: string;
  }[];
};

export default function CategoryPage() {
  const params = useParams();
  const slugParam = params.slug as string;

  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (!slugParam) return;

    async function fetchSessions() {
      const categoryName =
        slugParam.charAt(0).toUpperCase() + slugParam.slice(1);

      const query = `*[_type == "photo" && category == "${categoryName}"]{
        title,
        "slug": slug.current,
        "gallery": gallery[]{
          "image": image,
          caption
        }
      }`;

      const data = await sanityClient.fetch(query);
      setSessions(data);
    }

    fetchSessions();
  }, [slugParam]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">

      <div className="max-w-6xl mx-auto">

        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-16 text-[11px] tracking-[0.25em] uppercase text-white/40">
          <Link
            href="/"
            className="hover:text-white transition"
          >
            ← Home
          </Link>

          <span className="text-white/30 capitalize">
            {slugParam}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-16 tracking-tight capitalize">
          {slugParam} Sessions
        </h1>

        {/* Session Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sessions.map((session) => {
            const coverImage = session.gallery?.[0];
            if (!coverImage?.image) return null;

            return (
              <Link
                key={session.slug}
                href={`/sessions/${session.slug}`}
              >
                <div className="cursor-pointer group">

                  <Image
                    src={urlFor(coverImage.image)
                      .width(1200)
                      .url()}
                    alt={session.title}
                    width={1200}
                    height={800}
                    className="rounded-2xl w-full h-auto transition duration-500 group-hover:opacity-90"
                  />

                  <h2 className="mt-6 text-xl font-serif tracking-wide text-white/80 group-hover:text-white transition">
                    {session.title}
                  </h2>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}