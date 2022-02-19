[jsonld2graphobject](README.md) / Exports

# jsonld2graphobject

## Table of contents

### Functions

- [jsonld2graphobject](modules.md#jsonld2graphobject)

## Functions

### jsonld2graphobject

▸ **jsonld2graphobject**<`ReturnType`\>(`jsonLd`, `node`, `options?`): `Promise`<`ReturnType`\>

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
| `options?` | `Object` | - |
| `options.excludeContext` | `boolean` | - |

#### Returns

`Promise`<`ReturnType`\>

#### Defined in

[jsonld2graphobject.ts:235](https://github.com/o-development/jsonld2graphobject/blob/4c9bf6b/lib/jsonld2graphobject.ts#L235)
