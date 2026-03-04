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
      options: { source: "title" },
    }),

    defineField({
      name: "category",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Subcategory Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "coverImage",
    },
  },
});