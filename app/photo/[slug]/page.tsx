import { sanityServerClient } from "@/lib/sanity";
import { notFound } from "next/navigation";
import PhotoClient from "./PhotoClient";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const photo = await sanityServerClient.fetch(
  `*[_type == "photo" && slug.current == $slug][0]{
    _id,
    title,
    password, // 👈 MUST BE HERE
    "categoryTitle": category->title,
    "categorySlug": category->slug.current,
    images[]
  }`,
  { slug }
);

  if (!photo) return notFound();

  return <PhotoClient photo={photo} />;
}