import { JsonLdDocument, NodeObject } from "jsonld";

export const libraryFrame: NodeObject = {
  "@context": {
    Book: "http://example.org/Book",
    Library: "http://example.org/Location",
    location: "http://example.org/location",
    contains: {
      "@id": "http://example.org/contains",
      "@container": "@set",
      "@type": "@id",
    },
    creator: "http://example.org/creator",
    title: "http://example.org/title",
    foundIn: {
      "@id": "http://example.org/foundIn",
      "@type": "@id",
    },
  },
  "@type": "Library",
  contains: {
    "@type": "Book",
  },
};

export const nestedLibraryFrame: NodeObject = {
  "@context": {
    Library: "http://example.org/Location",
    location: "http://example.org/location",
    contains: {
      "@id": "http://example.org/contains",
      "@container": "@set",
      "@type": "@id",
    },
  },
  "@type": "Library",
  contains: {
    "@context": {
      Book: "http://example.org/Book",
      creator: "http://example.org/creator",
      title: "http://example.org/title",
      foundIn: {
        "@id": "http://example.org/foundIn",
        "@type": "@id",
      },
    },
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
  foundIn: LibraryType;
}

export const flattenedLibrary: JsonLdDocument = {
  "@context": {
    Book: "http://example.org/Book",
    Library: "http://example.org/Location",
    location: "http://example.org/location",
    contains: {
      "@id": "http://example.org/contains",
      "@container": "@set",
      "@type": "@id",
    },
    creator: "http://example.org/creator",
    title: "http://example.org/title",
    foundIn: {
      "@id": "http://example.org/foundIn",
      "@type": "@id",
    },
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
