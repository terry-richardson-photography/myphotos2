import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import { redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!category) redirect("/");

  const photos = await sanityServerClient.fetch(
    `*[_type == "photo" && category->slug.current == $category] | order(_createdAt desc){
      _id,
      title,
      slug,
      coverImage
    }`,
    { category }
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-20 capitalize">
          {category}
        </h1>

        {photos.length === 0 ? (
          <div className="text-center text-white/50">
            No photos found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {photos.map((photo: any) => {
              const slug = photo.slug?.current;

              return (
                <Link
                  key={photo._id}
                  href={slug ? `/photo/${slug}` : "#"}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl">

                    {photo.coverImage ? (
                      <Image
                        src={urlFor(photo.coverImage)
                          .width(1200)
                          .quality(80)
                          .url()}
                        alt={photo.title || "Photo"}
                        width={1200}
                        height={800}
                        className="w-full h-auto transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-[300px] bg-white/10 flex items-center justify-center text-white/40">
                        No Image
                      </div>
                    )}

                  </div>

                  <h2 className="mt-4 text-lg font-serif text-white/70 group-hover:text-white">
                    {photo.title || "Untitled"}
                  </h2>

                </Link>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}