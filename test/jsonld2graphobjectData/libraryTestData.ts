import jsonld2graphobjectTest from "./jsonld2graphobjectTest";

const libraryTestData: jsonld2graphobjectTest[] = [
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
    name: "handles a flat graph with one graph element",
    testData: {
      "@context": {
        "@vocab": "http://example.org/",
        contains: { "@type": "@id" },
      },
      "@graph": {
        "@id": "http://example.org/library",
        "@type": "Library",
        location: "Athens",
        contains: "http://example.org/library/the-republic",
      },
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result["@id"]).toBe("http://example.org/library");
      expect(result.location).toBe("Athens");
      expect(result.contains).toBe("http://example.org/library/the-republic");
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

  {
    name: "handles an object with nested context where the data relies on the parent context",
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
      expect(result.contains[0].contains[0]).toBe(result);
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
          "@id": "http://example.org/contains",
          "@container": { "@set": true },
          "@type": "@id",
        },
        Book: "http://example.org/Book",
      });
    },
  },

  {
    name: "handles an object with multiple instances of the same id",
    testData: {
      "@context": {
        friend: {
          "@id": "http://example.com/friend",
          "@type": "@id",
        },
        bendingTeacher: {
          "@id": "http://example.com/bendingTeacher",
          "@type": "@id",
        },
        friendshipStarted: {
          "@id": "http://example.com/friendshipStarted",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
        element: {
          "@id": "http://example.com/element",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      },
      "@id": "http://example.com/aang",
      friend: {
        "@id": "http://example.com/katara",
        friendshipStarted: "100AG",
      },
      bendingTeacher: {
        "@id": "http://example.com/katara",
        element: "water",
      },
    },
    testNode: "http://example.com/aang",
    expect: async (result) => {
      expect(result.friend).toBe(result.bendingTeacher);
      expect(result.friend.element).toBe("water");
      expect(result.bendingTeacher.friendshipStarted).toBe("100AG");
    },
  },

  {
    name: "handles an object with multiple instances of the same id with overlapping fields",
    testData: {
      "@context": {
        friend: {
          "@id": "http://example.com/friend",
          "@type": "@id",
        },
        bendingTeacher: {
          "@id": "http://example.com/bendingTeacher",
          "@type": "@id",
        },
        friendshipStarted: {
          "@id": "http://example.com/friendshipStarted",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
        element: {
          "@id": "http://example.com/element",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      },
      "@id": "http://example.com/aang",
      friend: {
        "@id": "http://example.com/katara",
        friendshipStarted: "100AG",
        friend: { "@id": "http://example.com/sokka" },
      },
      bendingTeacher: {
        "@id": "http://example.com/katara",
        element: "water",
        friend: { "@id": "http://example.com/toph" },
      },
    },
    testNode: "http://example.com/aang",
    expect: async (result) => {
      expect(result.friend).toBe(result.bendingTeacher);
      expect(result.friend.element).toBe("water");
      expect(result.bendingTeacher.friendshipStarted).toBe("100AG");
      expect(Array.isArray(result.friend.friend));
      expect(result.friend.friend[0]["@id"]).toBe("http://example.com/sokka");
      expect(result.friend.friend[1]["@id"]).toBe("http://example.com/toph");
    },
  },

  {
    name: "handles an object with multiple instances of the same id with overlapping fields where one is already an array",
    testData: {
      "@context": {
        friend: {
          "@id": "http://example.com/friend",
          "@type": "@id",
        },
        bendingTeacher: {
          "@id": "http://example.com/bendingTeacher",
          "@type": "@id",
        },
        friendshipStarted: {
          "@id": "http://example.com/friendshipStarted",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
        element: {
          "@id": "http://example.com/element",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      },
      "@id": "http://example.com/aang",
      friend: {
        "@id": "http://example.com/katara",
        friendshipStarted: "100AG",
        friend: [
          { "@id": "http://example.com/sokka" },
          { "@id": "http://example.com/zuko" },
        ],
      },
      bendingTeacher: {
        "@id": "http://example.com/katara",
        element: "water",
        friend: { "@id": "http://example.com/toph" },
      },
    },
    testNode: "http://example.com/aang",
    expect: async (result) => {
      expect(result.friend).toBe(result.bendingTeacher);
      expect(result.friend.element).toBe("water");
      expect(result.bendingTeacher.friendshipStarted).toBe("100AG");
      expect(Array.isArray(result.friend.friend));
      expect(result.friend.friend[0]["@id"]).toBe("http://example.com/sokka");
      expect(result.friend.friend[1]["@id"]).toBe("http://example.com/zuko");
      expect(result.friend.friend[2]["@id"]).toBe("http://example.com/toph");
    },
  },

  {
    name: "handles an object with multiple instances of the same id with overlapping fields where one is a duplicate value",
    testData: {
      "@context": {
        friend: {
          "@id": "http://example.com/friend",
          "@type": "@id",
        },
        bendingTeacher: {
          "@id": "http://example.com/bendingTeacher",
          "@type": "@id",
        },
        friendshipStarted: {
          "@id": "http://example.com/friendshipStarted",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
        element: {
          "@id": "http://example.com/element",
          "@type": "http://www.w3.org/2001/XMLSchema#string",
        },
      },
      "@id": "http://example.com/aang",
      friend: {
        "@id": "http://example.com/katara",
        friendshipStarted: "100AG",
        friend: [
          { "@id": "http://example.com/sokka" },
          { "@id": "http://example.com/zuko" },
        ],
      },
      bendingTeacher: {
        "@id": "http://example.com/katara",
        element: "water",
        friend: [
          { "@id": "http://example.com/toph" },
          { "@id": "http://example.com/zuko" },
        ],
      },
    },
    testNode: "http://example.com/aang",
    expect: async (result) => {
      expect(result.friend).toBe(result.bendingTeacher);
      expect(result.friend.element).toBe("water");
      expect(result.bendingTeacher.friendshipStarted).toBe("100AG");
      expect(Array.isArray(result.friend.friend));
      expect(result.friend.friend.length).toBe(4);
      expect(result.friend.friend[0]["@id"]).toBe("http://example.com/sokka");
      expect(result.friend.friend[1]["@id"]).toBe("http://example.com/zuko");
      expect(result.friend.friend[2]["@id"]).toBe("http://example.com/toph");
      expect(result.friend.friend[3]["@id"]).toBe("http://example.com/zuko");
    },
  },

  {
    name: "handles a graph with an id that doesn't link to anything in the graph",
    testData: {
      "@context": {
        "@vocab": "http://example.org/",
        contains: { "@type": "@id" },
      },
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: {
        "@id": "http://example.org/library/the-republic",
        "@type": "Book",
        creator: "Plato",
        title: "The Republic",
        contains: "http://example.org/library/the-republic#introduction",
      },
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result.contains.contains).toBe(
        "http://example.org/library/the-republic#introduction"
      );
    },
  },

  {
    name: "handles a graph with a set of ids that don't link to anything in the graph",
    testData: {
      "@context": {
        "@vocab": "http://example.org/",
        contains: { "@type": "@id" },
      },
      "@id": "http://example.org/library",
      "@type": "Library",
      location: "Athens",
      contains: {
        "@id": "http://example.org/library/the-republic",
        "@type": "Book",
        creator: "Plato",
        title: "The Republic",
        contains: [
          "http://example.org/library/the-republic#introduction",
          "http://example.org/library/the-republic#chapter1",
        ],
      },
    },
    testNode: "http://example.org/library",
    expect: async (result) => {
      expect(result.contains.contains[0]).toBe(
        "http://example.org/library/the-republic#introduction"
      );
      expect(result.contains.contains[1]).toBe(
        "http://example.org/library/the-republic#chapter1"
      );
    },
  },

  {
    name: "handles a remote context",
    testData: {
      "@context": [
        "https://json-ld.org/contexts/person.jsonld",
        {
          caption: "https://schema.org/caption",
        },
      ],
      "@graph": [
        {
          "@id": "http://manu.sporny.org/i",
          name: "Manu Sporny",
          image: "http://manu.sporny.org/images/manu.png",
        },
        {
          "@id": "http://manu.sporny.org/images/manu.png",
          caption: "Cool Pic",
        },
      ],
    },
    testNode: "http://manu.sporny.org/i",
    expect: async (result) => {
      const expectedContext = {
        Person: "http://xmlns.com/foaf/0.1/Person",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        name: "http://xmlns.com/foaf/0.1/name",
        nickname: "http://xmlns.com/foaf/0.1/nick",
        affiliation: "http://schema.org/affiliation",
        depiction: {
          "@id": "http://xmlns.com/foaf/0.1/depiction",
          "@type": "@id",
        },
        image: { "@id": "http://xmlns.com/foaf/0.1/img", "@type": "@id" },
        born: {
          "@id": "http://schema.org/birthDate",
          "@type": "http://www.w3.org/2001/XMLSchema#date",
        },
        child: { "@id": "http://schema.org/children", "@type": "@id" },
        colleague: { "@id": "http://schema.org/colleagues", "@type": "@id" },
        knows: { "@id": "http://xmlns.com/foaf/0.1/knows", "@type": "@id" },
        died: {
          "@id": "http://schema.org/deathDate",
          "@type": "http://www.w3.org/2001/XMLSchema#date",
        },
        email: { "@id": "http://xmlns.com/foaf/0.1/mbox", "@type": "@id" },
        familyName: "http://xmlns.com/foaf/0.1/familyName",
        givenName: "http://xmlns.com/foaf/0.1/givenName",
        gender: "http://schema.org/gender",
        homepage: {
          "@id": "http://xmlns.com/foaf/0.1/homepage",
          "@type": "@id",
        },
        honorificPrefix: "http://schema.org/honorificPrefix",
        honorificSuffix: "http://schema.org/honorificSuffix",
        jobTitle: "http://xmlns.com/foaf/0.1/title",
        nationality: "http://schema.org/nationality",
        parent: { "@id": "http://schema.org/parent", "@type": "@id" },
        sibling: { "@id": "http://schema.org/sibling", "@type": "@id" },
        spouse: { "@id": "http://schema.org/spouse", "@type": "@id" },
        telephone: "http://schema.org/telephone",
        Address: "http://www.w3.org/2006/vcard/ns#Address",
        address: "http://www.w3.org/2006/vcard/ns#address",
        street: "http://www.w3.org/2006/vcard/ns#street-address",
        locality: "http://www.w3.org/2006/vcard/ns#locality",
        region: "http://www.w3.org/2006/vcard/ns#region",
        country: "http://www.w3.org/2006/vcard/ns#country",
        postalCode: "http://www.w3.org/2006/vcard/ns#postal-code",
        caption: "https://schema.org/caption",
      };

      expect(result["@id"]).toBe("http://manu.sporny.org/i");
      expect(result.image.caption).toBe("Cool Pic");
      expect(result["@context"]).toMatchObject(expectedContext);
      expect(result.image["@context"]).toMatchObject(expectedContext);
    },
  },

  // TODO: test case where a graph is a string
  // TODO: test case where a graph has an id (named graphs)
];

export default libraryTestData;
