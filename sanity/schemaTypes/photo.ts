import { defineType, defineField } from "sanity";

export default defineType({
  name: "photo",
  title: "Session",
  type: "document",

  fields: [

    defineField({
      name: "title",
      title: "Session Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Family", value: "family" },
          { title: "Travel", value: "travel" },
          { title: "General", value: "general" },
          { title: "Commercial", value: "commercial" },
          { title: "Sport", value: "sport" },
          { title: "General-Photography", value: "general-photography" },
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "subcategory" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sessionCover",
      title: "Session Cover Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "shootDate",
      title: "Shoot Date",
      type: "date",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "password",
      title: "Session Password (Optional)",
      type: "string",
    }),

    defineField({
      name: "gallery",
      title: "Image Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

  ],   // ← THIS WAS MISSING BEFORE

  preview: {
    select: {
      title: "title",
      media: "sessionCover",
      category: "category",
      subcategory: "subcategory.title",
    },

    prepare({ title, media, category, subcategory }) {
      return {
        title,
        subtitle: `${category || "Category"} → ${subcategory || "Subcategory"}`,
        media,
      };
    },
  },
});