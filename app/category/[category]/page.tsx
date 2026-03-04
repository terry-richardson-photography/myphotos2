import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { redirect } from "next/navigation";

export const revalidate = 300;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!category) redirect("/");

  const subcategories = await sanityServerClient.fetch(
    `*[_type == "subcategory" && category->slug.current == $category]{
      _id,
      title,
      slug,
      coverImage
    } | order(title asc)`,
    { category }
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-20 capitalize">
          {category}
        </h1>

        {subcategories.length === 0 ? (
          <div className="text-center text-white/50">
            No subcategories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">

            {subcategories.map((sub: any) => (
              <Link
                key={sub._id}
                href={`/category/${category}/${sub.slug.current}`}
              >
                <div className="group cursor-pointer relative">

                  {sub.coverImage && (
                    <Image
                      src={urlFor(sub.coverImage)
                        .width(1400)
                        .quality(80)
                        .format("webp")
                        .url()}
                      alt={sub.title}
                      width={1400}
                      height={900}
                      className="rounded-2xl w-full h-auto transition duration-500 group-hover:opacity-90"
                    />
                  )}

                  <h2 className="mt-6 text-lg font-serif text-white/70 tracking-wide group-hover:text-white transition">
                    {sub.title}
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