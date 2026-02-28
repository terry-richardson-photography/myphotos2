import { NextResponse } from "next/server";
import { sanityServerClient } from "@/lib/sanity";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { slug, password } = await req.json();

  const session = await sanityServerClient.fetch(
    `*[_type == "photo" && slug.current == $slug][0]{ password }`,
    { slug }
  );

  console.log("Entered password:", password);
  console.log("Stored password:", session?.password);

  if (
    !session ||
    password?.trim() !== session.password?.trim()
  ) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(`session-${slug}`, "authorized", {
    httpOnly: true,
    path: "/",
  });

  return NextResponse.json({ success: true });
}