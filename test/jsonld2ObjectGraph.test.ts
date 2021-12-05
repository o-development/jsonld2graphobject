import { json2ObjectGraph } from "../lib";
import libraryTestData from "./jsonld2ObjectGraphData/libraryTestData";

describe("dataset2ObjectGraph", () => {
  libraryTestData.forEach((testData) => {
    it(testData.name, async () => {
      const graph = await json2ObjectGraph(
        testData.testData,
        testData.testNode
      );
      await testData.expect(graph);
    });
  });

  it("errors if a node not in the graph is given", async () => {
    await expect(async () => {
      await json2ObjectGraph(
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
});
