import Image from "next/image";
import Link from "next/link";
import { sanityServerClient } from "../../../lib/sanity";
import { urlFor } from "../../../lib/image";
import { redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) redirect("/");

  const sessions = await sanityServerClient.fetch(
    `*[_type == "photo" && category == $category]{
      title,
      password,
      slug,
      coverImage
    }`,
    { category: slug }
  );

  if (!sessions.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No sessions found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-serif text-center mb-20 capitalize">
          {slug}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {sessions.map((session: any) => (
            <Link
              key={session.slug.current}
              href={`/sessions/${session.slug.current}`}
            >
              <div className="group cursor-pointer relative">

                {session.password && (
                  <div className="absolute top-4 left-4 z-10 bg-black/70 px-3 py-1 rounded-full text-[9px] uppercase text-white/80">
                    Private
                  </div>
                )}

                {session.coverImage && (
                  <Image
                    src={urlFor(session.coverImage)
                      .width(1200)
                      .quality(75)
                      .url()}
                    alt={session.title}
                    width={1200}
                    height={800}
                    className="rounded-2xl w-full h-auto"
                  />
                )}

                <h2 className="mt-6 text-lg font-serif text-white/70">
                  {session.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}