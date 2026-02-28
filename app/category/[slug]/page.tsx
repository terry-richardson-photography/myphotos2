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
  password?: string;
  gallery: {
    image: any;
    caption?: string;
  }[];
};

export default function CategoryPage() {
  const params = useParams();

  const slugParam = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug;

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slugParam) return;

    async function fetchSessions() {
      const query = `*[_type == "photo" && lower(category) == lower($category)]{
        title,
        password,
        "slug": slug.current,
        "gallery": gallery[]{
          image,
          caption
        }
      }`;

      const data = await sanityClient.fetch(query, {
        category: slugParam,
      });

      setSessions(data);
      setLoading(false);
    }

    fetchSessions();
  }, [slugParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-20 capitalize">
          {slugParam}
        </h1>

        {sessions.length === 0 && (
          <div className="text-center text-white/60">
            No sessions found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {sessions.map((session) => {
            const coverImage = session.gallery?.[0];
            if (!coverImage?.image) return null;

            return (
              <Link
                key={session.slug}
                href={`/sessions/${session.slug}`}
              >
                <div className="group cursor-pointer relative">

                  {session.password && (
                    <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] tracking-[0.3em] uppercase text-white/80 border border-white/20">
                      Private
                    </div>
                  )}

                  <Image
                    src={urlFor(coverImage.image)
                      .width(1200)
                      .quality(75)
                      .url()}
                    alt={session.title}
                    width={1200}
                    height={800}
                    className="rounded-2xl w-full h-auto transition duration-500 group-hover:opacity-90"
                  />

                  <h2 className="mt-6 text-lg font-serif tracking-wide text-white/70 group-hover:text-white transition duration-300">
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