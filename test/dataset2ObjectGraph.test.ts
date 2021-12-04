import { json2ObjectGraph } from "../src";
import libraryTestData from "./dataset2ObjectGraphData/libraryTestData";

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
});
