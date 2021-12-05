import { JsonLdDocument, NodeObject } from "jsonld";
import {
  ContextParser,
  IJsonLdContextNormalizedRaw,
} from "jsonld-context-parser";
import { v4 } from "uuid";

const contextParser = new ContextParser();

function isObject(value: unknown): value is NodeObject {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

interface TripleArcs {
  [subjectId: string]: {
    scopedContexts: IJsonLdContextNormalizedRaw[];
    predicates: {
      [predicateId: string]: string[];
    };
  };
}

/**
 * Helper function to set the proper tripleArcs values
 */
function setTripleArcs(
  tripleArcs: TripleArcs,
  subjectId: string,
  predicateId: string,
  objectId: string
) {
  if (!tripleArcs[subjectId]) {
    tripleArcs[subjectId] = {
      scopedContexts: [],
      predicates: {},
    };
  }
  if (!tripleArcs[subjectId].predicates[predicateId]) {
    tripleArcs[subjectId].predicates[predicateId] = [];
  }
  tripleArcs[subjectId].predicates[predicateId].push(objectId);
}

/**
 * Helper function to set scopedContext on tripleArcs
 */
function setScopedContext(
  tripleArcs: TripleArcs,
  subjectId: string,
  scopedContext?: IJsonLdContextNormalizedRaw
) {
  if (!tripleArcs[subjectId]) {
    tripleArcs[subjectId] = {
      scopedContexts: [],
      predicates: {},
    };
  }
  if (scopedContext) {
    tripleArcs[subjectId].scopedContexts.push(scopedContext);
  }
}

/**
 * Combines multiple contexts together
 */
async function combineContexts(
  contexts: IJsonLdContextNormalizedRaw[]
): Promise<IJsonLdContextNormalizedRaw> {
  return (await contextParser.parse(contexts)).getContextRaw();
}

/**
 * Recursively traverses an object to fill out the idMap and tripleArcs
 * @param object The object to traverse
 * @param idMap A map between the object Id and a collection of objects representing it
 * @param tripleArcs A collection of all the arcs between objects
 * @param parentIdPredicates The predicates that are mapped to @ids as defined by the context
 * @return the id of the given Node
 */
async function traverseNodesForIdsAndLeafs(
  object: NodeObject,
  idMap: Record<string, NodeObject[]>,
  tripleArcs: TripleArcs,
  parentScopedContext?: IJsonLdContextNormalizedRaw,
  // All predicates that are made of Ids
  parentIdPredicates?: Set<string>
): Promise<string> {
  let scopedContext: IJsonLdContextNormalizedRaw | undefined =
    parentScopedContext;
  // Get the current idPredicates. If this object does
  // have a context, then recalculate them.
  const idPredicates: Set<string> = parentIdPredicates || new Set<string>();
  if (object["@context"]) {
    scopedContext =
      // The typings for these two libraries disagree, but they are correct
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (await contextParser.parse(object["@context"])).getContextRaw();
    if (parentScopedContext) {
      scopedContext = await combineContexts([
        parentScopedContext,
        scopedContext,
      ]);
    }
    Object.entries(scopedContext).forEach(([key, value]) => {
      if (key.charAt(0) === "@") return;
      if (isObject(value) && value["@type"] && value["@type"] === "@id") {
        idPredicates.add(key);
      } else if (idPredicates.has(key)) {
        idPredicates.delete(key);
      }
    });
  }

  // Record this node's Id
  const objectId = object["@id"] || v4();
  if (!idMap[objectId]) {
    idMap[objectId] = [];
  }
  idMap[objectId].push(object);

  // Traverse the keys of this Object
  await Promise.all(
    Object.entries(object).map(async ([key, value]) => {
      if (key === "@graph") {
        // TODO: handle the case the a graph is a string
        const graph: NodeObject[] = (
          Array.isArray(value) ? value : [value]
        ) as NodeObject[];
        await Promise.all(
          graph.map(async (graphValue: NodeObject) => {
            await traverseNodesForIdsAndLeafs(
              graphValue,
              idMap,
              tripleArcs,
              scopedContext,
              idPredicates
            );
          })
        );
      }
      if (key.charAt(0) === "@") return;

      // Save object keys to triplearc
      if (isObject(value)) {
        const valueId = await traverseNodesForIdsAndLeafs(
          value,
          idMap,
          tripleArcs,
          scopedContext,
          idPredicates
        );
        setTripleArcs(tripleArcs, objectId, key, valueId);
      } else if (Array.isArray(value)) {
        await Promise.all(
          value.map(async (arrValue) => {
            if (isObject(arrValue)) {
              const valueId = await traverseNodesForIdsAndLeafs(
                arrValue as NodeObject,
                idMap,
                tripleArcs,
                scopedContext,
                idPredicates
              );
              setTripleArcs(tripleArcs, objectId, key, valueId);
            } else if (typeof arrValue === "string" && idPredicates.has(key)) {
              setTripleArcs(tripleArcs, objectId, key, arrValue as string);
            }
          })
        );
      } else if (typeof value === "string" && idPredicates.has(key)) {
        setTripleArcs(tripleArcs, objectId, key, value);
      }
    })
  );

  setScopedContext(tripleArcs, objectId, scopedContext);

  return objectId;
}

/**
 * Converts any JSON-LD object into object literals linked in a graph
 * @param jsonLd The JSON-LD document
 * @param node The id of the node that should be returned as the root value
 */
export async function json2ObjectGraph<ReturnType extends NodeObject>(
  jsonLd: JsonLdDocument,
  node: string
): Promise<ReturnType> {
  const jsonLdClone = JSON.parse(JSON.stringify(jsonLd));

  // Traverse the document, getting the leafs and the ids
  const idMap: Record<string, NodeObject[]> = {};
  const tripleArcs: TripleArcs = {};
  await traverseNodesForIdsAndLeafs(jsonLdClone, idMap, tripleArcs);

  // Consolodate all the objects in IdMap into one object
  const consolodatedIdMap: Record<string, NodeObject> = {};
  Object.entries(idMap).forEach(([key, value]) => {
    consolodatedIdMap[key] = value.reduce((agg, newNode) => {
      return { ...agg, ...newNode };
    }, {});
  });

  // Get the node to return
  const nodeToReturn = consolodatedIdMap[node];
  if (!nodeToReturn) {
    throw new Error(`Node "${node}" is not in the graph.`);
  }

  // Link the triple arcs
  await Promise.all(
    Object.entries(tripleArcs).map(async ([subjectId, subjectInfo]) => {
      const subject = consolodatedIdMap[subjectId];

      // Construct to @context for this subject
      if (subjectInfo.scopedContexts.length > 0) {
        // Again, these two library types do not work together, but it's actual fine.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        subject["@context"] = await combineContexts(subjectInfo.scopedContexts);
      }

      // Build the object links
      Object.entries(subjectInfo.predicates).forEach(
        ([predicate, objectIds]) => {
          if (
            objectIds.length === 1 &&
            // Is not a container predicate
            !(
              subject["@context"] &&
              (subject["@context"] as IJsonLdContextNormalizedRaw)[predicate] &&
              (subject["@context"] as IJsonLdContextNormalizedRaw)[predicate][
                "@container"
              ]
            )
          ) {
            subject[predicate] =
              consolodatedIdMap[objectIds[0]] || objectIds[0];
          } else {
            subject[predicate] = objectIds.map(
              (objectId) => consolodatedIdMap[objectId] || objectId
            );
          }
        }
      );
    })
  );

  return nodeToReturn as ReturnType;
}
