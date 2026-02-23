'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSessions() {
      const categoryName =
        slug.charAt(0).toUpperCase() + slug.slice(1);

      const query = `*[_type == "photo" && category == "${categoryName}"]{
        title,
        slug,
        gallery
      }`;

      const data = await sanityClient.fetch(query);
      setSessions(data);
    }

    fetchSessions();
  }, [slug]);

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-serif text-center mb-12 capitalize">
        {slug} Sessions
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {sessions.map((session) => {
          const coverImage = session.gallery?.[0];
          if (!coverImage) return null;

          return (
            <Link
              key={session.slug.current}
              href={`/session/${session.slug.current}`}
            >
              <div className="cursor-pointer group">
                <Image
                  src={urlFor(coverImage).width(1200).url()}
                  alt={session.title}
                  width={1200}
                  height={800}
                  className="rounded-xl group-hover:opacity-90 transition"
                />
                <h2 className="mt-4 text-xl font-serif">
                  {session.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}