import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([

      // Categories
      S.documentTypeListItem("category")
        .title("Categories")
        .child(
          S.documentTypeList("category")
            .title("All Categories")
        ),


      // Sessions
      S.documentTypeListItem("photo")
        .title("Sessions")
        .child(
          S.documentTypeList("photo")
            .title("All Sessions")
        ),

    ]);