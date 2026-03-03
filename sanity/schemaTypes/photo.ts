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
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ✅ NEW STRUCTURE
// 🔹 Category
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

  defineField({
  name: "subcategory",
  title: "Subcategories",
  type: "array",
  of: [
    {
      type: "reference",
      to: [{ type: "subcategory" }],
    },
  ],
}),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "shootDate",
      title: "Shoot Date",
      type: "date",
      options: {
        dateFormat: "DD MMM YYYY",
      },
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "featured",
      title: "Featured Session",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "password",
      title: "Session Password (Optional)",
      type: "string",
      validation: (Rule) => Rule.max(50),
    }),

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
});