import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { redirect } from "next/navigation";

export const revalidate = 300; // ISR

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;

  if (!category || !subcategory) redirect("/");

  // Fetch sessions that reference this subcategory
 // 1️⃣ Get the subcategory document first
const subcategoryDoc = await sanityServerClient.fetch(
  `*[_type == "subcategory" && slug.current == $subcategory][0]{
     _id
   }`,
  { subcategory }
);

if (!subcategoryDoc?._id) redirect(`/category/${category}`);

// 2️⃣ Fetch sessions referencing this subcategory
const sessions = await sanityServerClient.fetch(
  `*[_type == "photo" && references($subcategoryId)]{
    _id,
    title,
    slug,
    sessionCover,
    password
  } | order(_createdAt desc)`,
  { subcategoryId: subcategoryDoc._id }
);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

       {/* Back to Category */}

<div className="sticky top-6 z-20 mb-16">
  <Link
    href={`/category/${category}`}
    className="inline-flex items-center gap-2 
               text-white/60 text-xs uppercase tracking-widest
               hover:text-white transition duration-300"
  >
    ← Back to {category}
  </Link>
</div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-20 capitalize tracking-wide">
          {subcategory}
        </h1>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center text-white/50">
            No sessions found in this subcategory.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">

            {sessions.map((session: any) => (
              <Link
                key={session._id}
                href={`/sessions/${session.slug.current}`}
              >
                <div className="group cursor-pointer relative">

                  {/* Private Badge */}
                  {session.password && (
                    <div className="absolute top-4 left-4 z-10 
                                    bg-black/70 backdrop-blur-sm
                                    px-3 py-1 rounded-full 
                                    text-[9px] uppercase tracking-widest">
                      Private
                    </div>
                  )}

                  {/* Cover Image */}
                  {session.sessionCover && (
  <Image
    src={urlFor(session.sessionCover)
      .width(1400)
      .quality(80)
      .format("webp")
      .url()}
    alt={session.title}
    width={1400}
    height={900}
    className="rounded-2xl w-full h-auto 
               transition duration-500
               group-hover:opacity-90"
  />
)}

                  {/* Session Title */}
                  <h2 className="mt-8 text-lg font-serif text-white/70 
                                 tracking-wide group-hover:text-white transition">
                    {session.title}
                  </h2>

                </div>
              </Link>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}