import { serializedToDataset } from "o-dataset-pack";
import { dataset2ObjectGraph } from "../src";
import libraryTestData from "./dataset2ObjectGraphData/libraryTestData";

describe("dataset2ObjectGraph", () => {
  libraryTestData.forEach((testData) => {
    it(testData.name, async () => {
      const dataset = await serializedToDataset(
        JSON.stringify(testData.testData),
        {
          format: "application/json-ld",
        }
      );
      const graph = await dataset2ObjectGraph(dataset, testData.testFrame);
      await testData.expect(graph);
    });
  });
});
