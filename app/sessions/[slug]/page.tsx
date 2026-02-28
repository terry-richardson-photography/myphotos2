import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sanityServerClient } from "../../../lib/sanity";
import Gallery from "./Gallery";
import PasswordGate from "./PasswordGate"; // ✅ HERE

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
      category,
      password,
      gallery
    }`,
    { slug }
  );

  if (!session) {
    return <div style={{ color: "white" }}>Session not found.</div>;
  }

  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get(`session-${slug}`);

  if (session.password && !isAuthorized) {
    return <PasswordGate slug={slug} />;
  }

  return <Gallery session={session} />;
}