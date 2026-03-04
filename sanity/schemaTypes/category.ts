import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
    }),

    defineField({
      name: "coverImage",
      title: "Category Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});