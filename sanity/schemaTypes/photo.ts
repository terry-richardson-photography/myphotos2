import { defineType, defineField } from "sanity";

export default defineType({
  name: "photo",
  title: "Session",
  type: "document",
  fields: [
    // 🔹 Title
    defineField({
      name: "title",
      title: "Session Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 🔹 Slug
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
        ],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),

  

    // 🔹 Shoot Date (for sorting)
    defineField({
      name: "shootDate",
      title: "Shoot Date",
      type: "date",
      options: {
        dateFormat: "DD MMM YYYY",
      },
    }),

    // 🔹 Description (SEO + intro text)
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),

    // 🔹 Featured Toggle (homepage control)
    defineField({
      name: "featured",
      title: "Featured Session",
      type: "boolean",
      initialValue: false,
    }),

    // 🔐 Password (Optional Protection)
    defineField({
      name: "password",
      title: "Session Password (Optional)",
      type: "string",
      description:
        "Leave empty for public sessions. Add a password to protect this session.",
      validation: (Rule) => Rule.max(50),
    }),

    // 🔹 Image Gallery
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