[jsonld2graphobject](README.md) / Exports

# jsonld2graphobject

## Table of contents

### Functions

- [json2ObjectGraph](modules.md#json2objectgraph)

## Functions

### json2ObjectGraph

▸ **json2ObjectGraph**<`ReturnType`\>(`jsonLd`, `node`): `Promise`<`ReturnType`\>

Converts any JSON-LD object into object literals linked in a graph

#### Type parameters

| Name | Type |
| :------ | :------ |
| `ReturnType` | extends `NodeObject` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsonLd` | `JsonLdDocument` | The JSON-LD document |
| `node` | `string` | The id of the node that should be returned as the root value |

#### Returns

`Promise`<`ReturnType`\>

#### Defined in

jsonld2ObjectGraph.ts:187
