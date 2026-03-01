import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "../lib/sanity";
import { urlFor } from "../lib/image";

export const revalidate = 300; // 5 minutes

type Session = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  coverImage: any;
};

export default async function HomePage() {
  const sessions: Session[] = await sanityServerClient.fetch(`
    *[_type == "photo"] | order(_createdAt desc){
      _id,
      title,
      slug,
      category,
      coverImage
    }
  `);

  const categories: string[] = Array.from(
    new Set(
      sessions
        .map((s) => s.category)
        .filter(Boolean)
    )
  );

  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="py-24 text-center px-6">
        <h1 className="text-5xl md:text-6xl font-serif tracking-tight">
          Terry Richardson Photography
        </h1>
      </section>

      {/* CATEGORY GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {categories.map((category) => {
            const session = sessions.find(
              (s) => s.category === category
            );

            if (!session?.coverImage) return null;

            return (
              <Link
                key={category}
                href={`/category/${category}`}
              >
                <div className="group cursor-pointer">

                  <Image
                    src={urlFor(session.coverImage)
                      .width(1200)
                      .quality(75)
                      .format("webp")
                      .url()}
                    alt={category}
                    width={1200}
                    height={800}
                    className="rounded-2xl object-cover h-72 w-full group-hover:opacity-90 transition duration-500"
                  />

                  <h2 className="mt-6 text-xl font-serif text-center tracking-wide">
                    {category}
                  </h2>

                </div>
              </Link>
            );
          })}

        </div>
      </section>

    </main>
  );
}