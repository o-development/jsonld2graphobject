import { Dataset } from "@rdfjs/types";
import { frame as parseFrame, fromRDF, NodeObject } from "jsonld";
import { ContextParser } from "jsonld-context-parser";

const contextParser = new ContextParser();

function isObject(value: unknown): value is NodeObject {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

interface UnfulfilledLeaf {
  leaf: NodeObject;
  key: string;
}

async function evaluateTraversedObject(
  originalOject: NodeObject,
  originalKey: string,
  value: unknown,
  idMap: Record<string, NodeObject>,
  unfulfilledLeafs: UnfulfilledLeaf[],
  idPredicates: Set<string>
) {
  // If value is an object, traverse recursively
  if (isObject(value)) {
    await traverseNodesForIdsAndLeafs(
      value,
      idMap,
      unfulfilledLeafs,
      idPredicates
    );
    // If value is an array, traverse recursively for all items in the array
  } else if (Array.isArray(value)) {
    await Promise.all(
      value.map(async (arrValue) => {
        await evaluateTraversedObject(
          originalOject,
          originalKey,
          arrValue,
          idMap,
          unfulfilledLeafs,
          idPredicates
        );
      })
    );
    // If the value is a string, but its key is also in the idPredicates set, it is an
    // unfulfilled leaf
  } else if (typeof value === "string" && idPredicates.has(originalKey)) {
    unfulfilledLeafs.push({
      leaf: originalOject,
      key: originalKey,
    });
  }
}

async function traverseNodesForIdsAndLeafs(
  object: NodeObject,
  idMap: Record<string, NodeObject>,
  unfulfilledLeafs: UnfulfilledLeaf[],
  // All predicates that are made of Ids
  parentIdPredicates?: Set<string>
): Promise<void> {
  // Must have a context
  if (!object["@context"] && !parentIdPredicates) {
    throw new Error("Must have a context");
  }

  // Get the current idPredicates. If this object does
  // have a context, then recalculate them.
  const idPredicates: Set<string> = parentIdPredicates || new Set<string>();
  if (object["@context"]) {
    const context =
      // The typings for these two libraries disagree, but they are correct
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (await contextParser.parse(object["@context"])).getContextRaw();
    Object.entries(context).forEach(([key, value]) => {
      if (key.charAt(0) === "@") return;
      if (isObject(value) && value["@type"] && value["@type"] === "@id") {
        idPredicates.add(key);
      } else if (idPredicates.has(key)) {
        idPredicates.delete(key);
      }
    });
  }

  // Record this node's Id
  if (object["@id"]) {
    idMap[object["@id"]] = object;
  }

  // Traverse the keys of this Object
  await Promise.all(
    Object.entries(object).map(async ([key, value]) => {
      if (key.charAt(0) === "@") return;
      await evaluateTraversedObject(
        object,
        key,
        value,
        idMap,
        unfulfilledLeafs,
        idPredicates
      );
    })
  );
}

export async function dataset2ObjectGraph<ReturnType extends NodeObject>(
  dataset: Dataset,
  frame: NodeObject
): Promise<ReturnType> {
  // Get Framed Object
  const framedObject = await parseFrame(await fromRDF(dataset), frame);

  // Traverse the document, getting the leafs and the ids
  const idMap: Record<string, NodeObject> = {};
  const unfulfilledLeafs: UnfulfilledLeaf[] = [];
  await traverseNodesForIdsAndLeafs(framedObject, idMap, unfulfilledLeafs);
  unfulfilledLeafs.forEach((unfulfilledLeaf) => {
    const leafValue = unfulfilledLeaf.leaf[unfulfilledLeaf.key];
    if (typeof leafValue === "string" && idMap[leafValue]) {
      unfulfilledLeaf.leaf[unfulfilledLeaf.key] = idMap[leafValue];
    } else if (Array.isArray(leafValue)) {
      leafValue.forEach((leafArrValue, index) => {
        if (typeof leafArrValue === "string" && idMap[leafArrValue]) {
          leafValue[index] = idMap[leafArrValue];
        }
      });
    }
  });

  return framedObject as ReturnType;
}
