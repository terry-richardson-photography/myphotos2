import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "3zdn0cy5",
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// 🔁 Set to false when ready to apply changes
const DRY_RUN = true;

async function migrate() {
  console.log(`🚀 Migration started (dryRun: ${DRY_RUN})\n`);

  const photos = await client.fetch(`
    *[_type == "photo" && defined(subcategory)]{
      _id,
      title,
      subcategory->{
        title,
        category->{
          _id,
          title
        }
      }
    }
  `);

  console.log(`Found ${photos.length} items\n`);

  let updated = 0;
  let skipped = 0;

  for (const photo of photos) {
    const category = photo.subcategory?.category;

    if (!category?._id) {
      console.log(`⚠️ Skipping "${photo.title}" (no category found)`);
      skipped++;
      continue;
    }

    console.log(`➡️ ${photo.title}`);
    console.log(`   → Category: ${category.title}`);

    if (!DRY_RUN) {
      await client
        .patch(photo._id)
        .set({
          category: {
            _type: "reference",
            _ref: category._id,
          },
        })
        .unset(["subcategory"])
        .commit();
    }

    updated++;
  }

  console.log("\n📊 Done:");
  console.log(`✅ Updated: ${updated}`);
  console.log(`⚠️ Skipped: ${skipped}`);
}

migrate().catch(console.error);