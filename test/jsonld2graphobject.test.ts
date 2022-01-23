import { jsonld2graphobject } from "../lib";
import libraryTestData from "./jsonld2graphobjectData/libraryTestData";

describe("dataset2ObjectGraph", () => {
  libraryTestData.forEach((testData) => {
    it(testData.name, async () => {
      const graph = await jsonld2graphobject(
        testData.testData,
        testData.testNode
      );
      await testData.expect(graph);
    });
  });

  it("errors if a node not in the graph is given", async () => {
    await expect(async () => {
      await jsonld2graphobject(
        {
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
        "http://unknown.node"
      );
    }).rejects.toBeInstanceOf(Error);
  });

  it("excludes context", async () => {
    const result = await jsonld2graphobject(
      {
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
      "http://example.org/library",
      { excludeContext: true }
    );
    expect(result["@context"]).toBe(undefined);
  });
});
