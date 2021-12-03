import dataset2ObjectGraphTest from "./dataset2ObjectGraphTest";

const genericFlattenedLibraryGraph = {
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
};

const multilingualLibraryGraph = {
  "@context": {
    "@vocab": "http://example.org/",
    contains: { "@type": "@id" },
  },
  "@graph": [
    {
      "@id": "http://example.org/library",
      "@type": "Library",
      location: [
        { "@value": "Athens", "@language": "en" },
        { "@value": "Αθήνα", "@language": "grc" },
        { "@value": "Athína", "@language": "el-Latn" },
      ],
      contains: "http://example.org/library/the-republic",
    },
    {
      "@id": "http://example.org/library/the-republic",
      "@type": "Book",
      creator: [
        { "@value": "Plato", "@language": "en" },
        { "@value": "Πλάτων", "@language": "grc" },
        { "@value": "Plátōn", "@language": "el-Latn" },
      ],
      title: [
        { "@value": "The Republic", "@language": "en" },
        { "@value": "Πολιτεία", "@language": "grc" },
        { "@value": "Res Publica", "@language": "el-Latn" },
      ],
      contains: "http://example.org/library/the-republic#introduction",
    },
    {
      "@id": "http://example.org/library/the-republic#introduction",
      "@type": "Chapter",
      description: "An introductory chapter on The Republic.",
      title: "The Introduction",
    },
  ],
};

const libraryTestData: dataset2ObjectGraphTest[] = [
  // {
  //   name: "handles a basic tree",
  //   testData: genericFlattenedLibraryGraph,
  //   testFrame: {
  //     "@context": { "@vocab": "http://example.org/" },
  //     "@type": "Library",
  //     contains: {
  //       "@type": "Book",
  //       contains: {
  //         "@type": "Chapter",
  //       },
  //     },
  //   },
  //   expect: async (result) => {
  //     expect(result);
  //     expect(result.location).toBe("Athens");
  //     expect(result.contains.title).toBe("The Republic");
  //     expect(result.contains.contains.title).toBe("The Introduction");
  //   },
  // },

  // {
  //   name: "handles a basic circuit",
  //   testData: {
  //     "@context": {
  //       Book: "http://example.org/Book",
  //       Library: "http://example.org/Location",
  //       location: "http://example.org/location",
  //       contains: {
  //         "@id": "http://example.org/contains",
  //         "@container": "@set",
  //         "@type": "@id",
  //       },
  //       creator: "http://example.org/creator",
  //       title: "http://example.org/title",
  //       foundIn: {
  //         "@id": "http://example.org/foundIn",
  //         "@type": "@id",
  //       },
  //     },
  //     "@graph": [
  //       {
  //         "@id": "http://example.org/library",
  //         "@type": "Library",
  //         location: "Athens",
  //         contains: [
  //           "http://example.org/library/the-republic",
  //           "http://example.org/library/hop-on-pop",
  //         ],
  //       },
  //       {
  //         "@id": "http://example.org/library/the-republic",
  //         "@type": "Book",
  //         creator: "Plato",
  //         title: "The Republic",
  //         foundIn: "http://example.org/library",
  //       },
  //       {
  //         "@id": "http://example.org/library/hop-on-pop",
  //         "@type": "Book",
  //         creator: "Dr. Seuss",
  //         title: "Hop on Pop",
  //         foundIn: "http://example.org/library",
  //       },
  //     ],
  //   },
  //   testFrame: {
  //     "@context": {
  //       Book: "http://example.org/Book",
  //       Library: "http://example.org/Location",
  //       location: "http://example.org/location",
  //       contains: {
  //         "@id": "http://example.org/contains",
  //         "@container": "@set",
  //         "@type": "@id",
  //       },
  //       creator: "http://example.org/creator",
  //       title: "http://example.org/title",
  //       foundIn: {
  //         "@id": "http://example.org/foundIn",
  //         "@type": "@id",
  //       },
  //     },
  //     "@type": "Library",
  //     contains: {
  //       "@type": "Book",
  //     },
  //   },
  //   expect: async (result) => {
  //     expect(result);
  //     expect(result.location).toBe("Athens");
  //     expect(result.contains[0].title).toBe("The Republic");
  //     expect(result.contains[1].title).toBe("Hop on Pop");
  //     expect(result.contains[0].foundIn).toBe(result);
  //     expect(result.contains[1].foundIn).toBe(result);
  //     expect(
  //       result.contains[0].foundIn.contains[0].foundIn.contains[0].foundIn
  //         .contains[0].foundIn.contains[0].foundIn
  //     ).toBe(result);
  //   },
  // },

  {
    name: "handles a basic frame without type matching",
    testData: genericFlattenedLibraryGraph,
    testFrame: {
      "@context": { "@vocab": "http://example.org/" },
      location: "Athens",
      contains: {
        title: "The Republic",
        contains: {
          title: "The Introduction",
        },
      },
    },
    expect: async (result) => {
      console.log(result);
      expect(result);
      expect(result.location).toBe("Athens");
      expect(result.contains.title).toBe("The Republic");
      expect(result.contains.contains.title).toBe("The Introduction");
    },
  },

  // {
  //   name: "hanldes a basic wildcard matched frame",
  //   testData: genericFlattenedLibraryGraph,
  //   testFrame: {
  //     "@context": { "@vocab": "http://example.org/" },
  //     location: {},
  //     contains: {
  //       creator: {},
  //       contains: {
  //         description: {},
  //       },
  //     },
  //   },
  //   expect: async (result) => {
  //     expect(result);
  //     expect(result.location).toBe("Athens");
  //     expect(result.contains.title).toBe("The Republic");
  //     expect(result.contains.contains.title).toBe("The Introduction");
  //   },
  // },

  // {
  //   name: "handles basic absent property frame",
  //   testData: genericFlattenedLibraryGraph,
  //   testFrame: {
  //     "@context": { "@vocab": "http://example.org/" },
  //     creator: [],
  //     title: [],
  //     contains: {
  //       location: [],
  //       description: [],
  //       contains: {
  //         location: [],
  //       },
  //     },
  //   },
  //   expect: async (result) => {
  //     expect(result);
  //     expect(result.location).toBe("Athens");
  //     expect(result.contains.title).toBe("The Republic");
  //     expect(result.contains.contains.title).toBe("The Introduction");
  //     expect(result.creator).toBe(null);
  //     expect(result.contains.description).toBe(null);
  //   },
  // },

  // {
  //   name: "handle multilingual graph",
  //   testData: multilingualLibraryGraph,
  //   testFrame: {
  //     "@context": { "@vocab": "http://example.org/" },
  //     location: { "@value": {}, "@language": "el-Latn" },
  //     contains: {
  //       creator: { "@value": {}, "@language": "el-Latn" },
  //       title: { "@value": {}, "@language": "el-Latn" },
  //       contains: {
  //         title: "The Introduction",
  //       },
  //     },
  //   },
  //   expect: async (result) => {
  //     expect(result.location["@language"]).toBe("el-Latn");
  //     expect(result.contains.title["@language"]).toBe("el-Latn");
  //   },
  // },

  // {
  //   name: "",
  //   testData: {},
  //   testFrame: {},
  //   expect: async (result) => {},
  // },

  // {
  //   name: "",
  //   testData: {},
  //   testFrame: {},
  //   expect: async (result) => {},
  // },
];

export default libraryTestData;
