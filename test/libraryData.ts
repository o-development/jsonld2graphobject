import { NodeObject } from "jsonld";

export const libraryFrame = {
  "@context": {
    "@vocab": "http://example.org/",
    contains: { "@id": "http://example.org/contains", "@type": "@id" },
  },
  "@type": "Library",
  contains: {
    "@type": "Book",
  },
};

export interface LibraryType extends NodeObject {
  "@context": { "@vocab": "http://example.org/" };
  "@id": string;
  "@type": "Library";
  location: string;
  contains: BookType[];
}

export interface BookType extends NodeObject {
  "@context": { "@vocab": "http://example.org/" };
  "@id": string;
  "@type": "Book";
  creator: string;
  title: string;
  foundIn: string;
}

export const flattenedLibrary = {
  "@context": {
    "@vocab": "http://example.org/",
    contains: { "@type": "@id" },
  },
  "@graph": [
    {
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: [
        "http://example.org/library/the-republic",
        "http://example.org/library/hop-on-pop",
      ],
    },
    {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      creator: "Plato",
      title: "The Republic",
      foundIn: "http://example.org/library",
    },
    {
      "@id": "http://example.org/library/hop-on-pop",
      "@type": "Book",
      creator: "Dr. Seuss",
      title: "Hop on Pop",
      foundIn: "http://example.org/library",
    },
  ],
};
