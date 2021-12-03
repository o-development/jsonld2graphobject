import { JsonLdDocument, NodeObject } from "jsonld";
import { Dataset } from "@rdfjs/types";
import { frame as parseFrame, fromRDF } from "jsonld";

export async function dataset2ObjectGraph<ReturnType extends NodeObject>(
  dataset: Dataset,
  frame: NodeObject
): Promise<ReturnType> {
  const framedObject = await parseFrame(await fromRDF(dataset), frame);
  return framedObject as ReturnType;
}

export function ObjectGraph2Dataset(objectGraph: NodeObject) {
  throw new Error("Not Implemented");
}
