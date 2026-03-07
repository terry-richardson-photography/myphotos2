import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "../lib/sanity";
import { urlFor } from "../lib/image";

export const revalidate = 300;

type Category = {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: any;
};

export default async function HomePage() {

  const categories: Category[] = await sanityServerClient.fetch(`
    *[_type == "category"] | order(title asc){
      _id,
      title,
      slug,
      coverImage
    }
  `);

  return (
    <main className="min-h-screen">

   {/* HERO IMAGE */}

<section className="relative h-[80vh] w-full overflow-hidden">

  <Image
    src="/hero.jpg"
    alt="Terry Richardson Photography"
    fill
    priority
   className="object-cover animate-heroCinematic"
  />

  <div className="absolute inset-0 bg-black/40"></div>

  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black"></div>

  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

    <h1 className="text-4xl md:text-6xl font-serif tracking-wide mb-4">
      Terry Richardson Photography
    </h1>

    <p className="text-xs uppercase tracking-[0.35em] text-white/70">
      Photographer • Adelaide South Australia
    </p>

  </div>

</section>

      {/* CATEGORY GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {categories.map((category) => (

            <Link
              key={category._id}
              href={`/category/${category.slug.current}`}
            >
              <div className="group cursor-pointer">

                {category.coverImage && (
                  <Image
                    src={urlFor(category.coverImage)
                      .width(1200)
                      .quality(75)
                      .format("webp")
                      .url()}
                    alt={category.title}
                    width={1200}
                    height={800}
                    className="rounded-2xl object-cover h-72 w-full group-hover:opacity-90 transition duration-500"
                  />
                )}

                <h2 className="mt-6 text-xl font-serif text-center tracking-wide">
                  {category.title}
                </h2>

              </div>
            </Link>

          ))}

        </div>
      </section>

    </main>
  );
}