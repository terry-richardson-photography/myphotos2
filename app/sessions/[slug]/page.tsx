import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sanityServerClient } from "../../../lib/sanity";
import Gallery from "./Gallery";
import PasswordGate from "./PasswordGate";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) redirect("/");

  const session = await sanityServerClient.fetch(
    `*[_type == "photo" && slug.current == $slug][0]{
      title,
      description,
      password,
      gallery,
      category,
      subcategory[]->{
        title,
        slug
      }
    }`,
    { slug }
  );

  if (!session) {
    return <div className="text-white">Session not found.</div>;
  }

  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get(`session-${slug}`);

  if (session.password && !isAuthorized) {
    return <PasswordGate slug={slug} />;
  }

  const firstSub = session.subcategory?.[0];

  const categoryMap: Record<string, { slug: string; title: string }> = {
  general: {
    slug: "general-photography",
    title: "General Photography",
  },
  family: {
    slug: "family",
    title: "Family",
  },
  travel: {
    slug: "travel",
    title: "Travel",
  },
  commercial: {
    slug: "commercial",
    title: "Commercial",
  },
  sport: {
    slug: "sport",
    title: "Sport",
  },
};

const categoryData =
  categoryMap[session.category] || {
    slug: session.category,
    title: session.category,
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* Back Navigation */}
        <div className="mb-16">

          {firstSub ? (
            <Link
              href={`/category/${session.category}/${firstSub.slug.current}`}
              className="inline-flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest hover:text-white transition"
            >
              ← Back to {firstSub.title}
            </Link>
          ) : (
           <Link
  href={`/category/${categoryData.slug}`}
  className="inline-flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest hover:text-white transition"
>
  ← Back to {categoryData.title}
</Link>
          )}

        </div>

        {/* Gallery */}
        <Gallery session={session} />

      </div>
    </main>
  );
}