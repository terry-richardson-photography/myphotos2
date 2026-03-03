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

  // Use first subcategory for navigation
  const firstSub = session.subcategory?.[0];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">

        {/* Back Navigation */}
        <div className="mb-16 space-y-4">

          {firstSub ? (
            <Link
              href={`/category/${session.category}/${firstSub.slug.current}`}
              className="inline-flex items-center gap-2 
                         text-white/60 text-xs uppercase tracking-widest
                         hover:text-white transition duration-300"
            >
              ← Back to {firstSub.title}
            </Link>
          ) : (
            <Link
              href={`/category/${session.category}`}
              className="inline-flex items-center gap-2 
                         text-white/60 text-xs uppercase tracking-widest
                         hover:text-white transition duration-300"
            >
              ← Back to {session.category}
            </Link>
          )}

        </div>

        {/* Gallery Component */}
        <Gallery session={session} />

      </div>
    </main>
  );
}