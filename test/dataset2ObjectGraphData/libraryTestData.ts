import dataset2ObjectGraphTest from "./dataset2ObjectGraphTest";

const libraryTestData: dataset2ObjectGraphTest[] = [
  {
    name: "handles a flat tree graph with context",
    testData: {
      "@context": {
        "@vocab": "http://example.org/",
        contains: { "@type": "@id" },
      },
      "@graph": [
        {
          "@id": "http://example.org/library",
          "@type": "Library",
          location: "Athens",
          contains: "http://example.org/library/the-republic",
        },
        {
          "@id": "http://example.org/library/the-republic",
          "@type": "Book",
          creator: "Plato",
          title: "The Republic",
          contains: "http://example.org/library/the-republic#introduction",
        },
        {
          "@id": "http://example.org/library/the-republic#introduction",
          "@type": "Chapter",
          description: "An introductory chapter on The Republic.",
          title: "The Introduction",
        },
      ],
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains.title).toBe("The Republic");
      expect(result.contains.contains.title).toBe("The Introduction");
    },
  },

  {
    name: "handles a nested tree graph with context",
    testData: {
      "@context": { "@vocab": "http://example.org/" },
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: {
        "@id": "http://example.org/library/the-republic",
        "@type": "Book",
        creator: "Plato",
        title: "The Republic",
        contains: {
          "@id": "http://example.org/library/the-republic#introduction",
          "@type": "Chapter",
          description: "An introductory chapter on The Republic.",
          title: "The Introduction",
        },
      },
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains.title).toBe("The Republic");
      expect(result.contains.contains.title).toBe("The Introduction");
    },
  },

  {
    name: "handles a flat circuit graph with context",
    testData: {
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
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result);
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains[0].title).toBe("The Republic");
      expect(result.contains[1].title).toBe("Hop on Pop");
      expect(result.contains[0].foundIn).toBe(result);
      expect(result.contains[1].foundIn).toBe(result);
    },
  },

  {
    name: "handles a nested circuit graph with context",
    testData: {
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
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: [
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
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      console.log(result);
      expect(result);
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains[0].title).toBe("The Republic");
      expect(result.contains[1].title).toBe("Hop on Pop");
      expect(result.contains[0].foundIn).toBe(result);
      expect(result.contains[1].foundIn).toBe(result);
    },
  },

  {
    name: "handles a flat tree graph without context",
    testData: {
      "@graph": [
        {
          "@id": "http://example.com/katara",
          "http://example.com/element": {
            "@id": "http://example.com/water",
          },
        },
        {
          "@id": "http://example.com/water",
          "http://example.com/specialPower": "healing",
        },
      ],
    },
    testNode: "http://example.com/katara",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.com/katara");
      expect(
        result["http://example.com/element"]["http://example.com/specialPower"]
      ).toBe("healing");
      expect(result["@context"]).toBeUndefined();
      expect(result["http://example.com/element"]["@context"]).toBeUndefined();
    },
  },

  {
    name: "handles a nested tree graph without context",
    testData: {
      "@id": "http://example.com/katara",
      "http://example.com/element": {
        "@id": "http://example.com/water",
        "http://example.com/specialPower": "healing",
      },
    },
    testNode: "http://example.com/katara",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.com/katara");
      expect(
        result["http://example.com/element"]["http://example.com/specialPower"]
      ).toBe("healing");
      expect(result["@context"]).toBeUndefined();
      expect(result["http://example.com/element"]["@context"]).toBeUndefined();
    },
  },

  {
    name: "handles a flat circuit graph without context",
    testData: {
      "@graph": [
        {
          "@id": "http://example.com/sokka",
          "http://example.com/knows": {
            "@id": "http://example.com/katara",
          },
        },
        {
          "@id": "http://example.com/katara",
          "http://example.com/knows": {
            "@id": "http://example.com/sokka",
          },
        },
      ],
    },
    testNode: "http://example.com/sokka",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.com/sokka");
      expect(result["http://example.com/knows"]["@id"]).toBe(
        "http://example.com/katara"
      );
      expect(
        result["http://example.com/knows"]["http://example.com/knows"]
      ).toBe(result);
      expect(result["@context"]).toBeUndefined();
      expect(result["http://example.com/knows"]["@context"]).toBeUndefined();
    },
  },

  {
    name: "handles a nested circuit graph without context",
    testData: {
      "@id": "http://example.com/sokka",
      "http://example.com/knows": {
        "@id": "http://example.com/katara",
        "http://example.com/knows": {
          "@id": "http://example.com/sokka",
        },
      },
    },
    testNode: "http://example.com/sokka",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.com/sokka");
      expect(result["http://example.com/knows"]["@id"]).toBe(
        "http://example.com/katara"
      );
      expect(
        result["http://example.com/knows"]["http://example.com/knows"]
      ).toBe(result);
      expect(result["@context"]).toBeUndefined();
      expect(result["http://example.com/knows"]["@context"]).toBeUndefined();
    },
  },

  {
    name: "handles context with the @container attribute, but it refers to a type with only one instance",
    testData: {
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
          contains: ["http://example.org/library/the-republic"],
        },
        {
          "@id": "http://example.org/library/the-republic",
          "@type": "Book",
          creator: "Plato",
          title: "The Republic",
          foundIn: "http://example.org/library",
        },
      ],
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result);
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains[0].title).toBe("The Republic");
      expect(result.contains[0].foundIn).toBe(result);
    },
  },

  {
    name: "handles an object with nested context",
    testData: {
      "@context": {
        Library: "http://example.org/Location",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/contains",
          "@container": "@set",
          "@type": "@id",
        },
      },
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: [
        {
          "@context": {
            Book: "http://example.org/Book",
            creator: "http://example.org/creator",
            title: "http://example.org/title",
            foundIn: {
              "@id": "http://example.org/foundIn",
              "@type": "@id",
            },
          },
          "@id": "http://example.org/library/the-republic",
          "@type": "Book",
          creator: "Plato",
          title: "The Republic",
          foundIn: "http://example.org/library",
        },
      ],
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result);
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains[0].title).toBe("The Republic");
      expect(result.contains[0].foundIn).toBe(result);
      expect(result["@context"]).toMatchObject({
        Library: "http://example.org/Location",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/contains",
          "@container": { "@set": true },
          "@type": "@id",
        },
      });
      expect(result.contains[0]["@context"]).toMatchObject({
        Library: "http://example.org/Location",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/contains",
          "@container": { "@set": true },
          "@type": "@id",
        },
        Book: "http://example.org/Book",
        creator: "http://example.org/creator",
        title: "http://example.org/title",
        foundIn: {
          "@id": "http://example.org/foundIn",
          "@type": "@id",
        },
      });
    },
  },

  {
    name: "handles an object with nested context that overrides the original",
    testData: {
      "@context": {
        Library: "http://example.org/Library",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/contains",
          "@container": "@set",
          "@type": "@id",
        },
      },
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: [
        {
          "@context": {
            contains: {
              "@id": "http://example.org/containsString",
              "@type": "http://www.w3.org/2001/XMLSchema#string",
            },
            Book: "http://example.org/Book",
          },
          "@id": "http://example.org/library/the-republic",
          "@type": "Book",
          contains: "http://example.org/library",
        },
      ],
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result);
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains[0].contains).toBe("http://example.org/library");
      expect(result["@context"]).toMatchObject({
        Library: "http://example.org/Library",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/contains",
          "@container": { "@set": true },
          "@type": "@id",
        },
      });
      expect(result.contains[0]["@context"]).toMatchObject({
        Library: "http://example.org/Library",
        location: "http://example.org/location",
        contains: {
          "@id": "http://example.org/containsString",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
        Book: "http://example.org/Book",
      });
    },
  },

  // Nested context with an object that relies on the parent context

  // Multiple instances of the same id

  // Multiple intances of the same id and overlapping fields

  // Multiple instances of the same id and overlapping fields, one is not an array

  // Multiple instances of the same id and overlapping fields with duplicate values

  // @container in context

  // Remote context
];

export default libraryTestData;
