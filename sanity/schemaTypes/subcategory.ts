import { defineType, defineField } from "sanity";

export default defineType({
  name: "subcategory",
  title: "Subcategory",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Subcategory Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Parent Category",
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

    // 🔥 NEW FIELD
    defineField({
      name: "coverImage",
      title: "Subcategory Cover Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "description",
      title: "Description (Optional)",
      type: "text",
      rows: 3,
    }),
  ],
});