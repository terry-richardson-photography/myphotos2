import { createClient } from "@sanity/client";

/*
  IMPORTANT:
  Make sure these exist in:
  - .env.local
  - Vercel Environment Variables
*/

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

/*
  PUBLIC CLIENT
  Safe for browser (no token)
  Uses CDN for speed
*/
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/*
  SERVER CLIENT
  Runs only on server
  No CDN (fresh data)
*/
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});