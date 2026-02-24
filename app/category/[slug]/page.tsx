'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";

type Session = {
  title: string;
  slug: string; // flattened
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
    <main className="min-h-screen bg-white px-6 py-16">
      <h1 className="text-4xl font-serif text-center mb-12 capitalize">
        {slugParam} Sessions
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
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