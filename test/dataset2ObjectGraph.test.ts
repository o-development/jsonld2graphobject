import { Dataset } from "@rdfjs/types";
import { serializedToDataset } from "o-dataset-pack";
import { dataset2ObjectGraph } from "../src";
import { flattenedLibrary, libraryFrame } from "./libraryData";
import { LibraryType } from "./libraryData";

describe("dataset2ObjectGraph", () => {
  let dataset: Dataset;

  beforeEach(async () => {
    dataset = await serializedToDataset(JSON.stringify(flattenedLibrary), {
      format: "application/json-ld",
    });
  });

  it("converts the object", async () => {
    const libraryGraph = await dataset2ObjectGraph<LibraryType>(
      dataset,
      libraryFrame
    );
    expect(libraryGraph);
    expect(libraryGraph.location).toBe("Athens");
    expect(libraryGraph.contains[0].title).toBe("The Republic");
    expect(libraryGraph.contains[1].title).toBe("Hop on Pop");
    expect(libraryGraph.contains[0].foundIn).toBe(libraryGraph);
    expect(libraryGraph.contains[1].foundIn).toBe(libraryGraph);
  });
});
