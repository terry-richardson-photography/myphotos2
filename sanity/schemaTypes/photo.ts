import { defineType, defineField } from "sanity";

export default defineType({
  name: "photo",
  title: "Session",
  type: "document",

  fields: [

    // Session Title
    defineField({
      name: "title",
      title: "Session Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // Slug
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    // Category
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
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Subcategory reference
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "reference",
      to: [{ type: "subcategory" }],
      validation: (Rule) => Rule.required(),
    }),

    // Session Cover Image
    defineField({
      name: "sessionCover",
      title: "Session Cover Image",
      type: "image",
      options: { hotspot: true },
    }),

    // Shoot Date
    defineField({
      name: "shootDate",
      title: "Shoot Date",
      type: "date",
    }),

    // Description
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    // Password protection
    defineField({
      name: "password",
      title: "Session Password (Optional)",
      type: "string",
    }),

    // Gallery
    defineField({
      name: "gallery",
      title: "Image Gallery",
      type: "array",
      of: [
        {
          type: "object",
          name: "imageWithCaption",
          title: "Image",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
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

  ],

  // ⭐ Preview in Studio lists
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