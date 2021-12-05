jsonld2graphobject / [Exports](modules.md)

# JSON 2 Graph Object

JSON-LD makes working with RDF easier, but it forces data into a tree structure. JSON 2 Graph Object makes a true graph from Object literals.

## Purpose
JSON-LD is great for making RDF easy for JavaScript developers, but it's not perfect.

```json
{
  "@context": {
    "friend": { "@type": "@id" }
  },
  "@id": "http://example.com/friend1",
  "friend": {
    "@id": "http://example.com/friend2",
    "friend": "http://example.com/friend1"
  }
}
```

The above example is not a true graph, as the `friend` field in `friend2` is simply the id of the friend, not the friend itself.

## Intallation

```bash
npm i jsonld2graphobject
```

## Usage

Provide any compliant JSON-LD document as well as the id for the return node.

```javascript
import { jsonld2graphobject } from "jsonld2graphobject";

async function run() {
  const friend1 = jsonld2graphobject(
    {
      "@context": {
        "friend": { "@type": "@id" }
      },
      "@id": "http://example.com/friend1",
      "friend": {
        "@id": "http://example.com/friend2",
        "friend": "http://example.com/friend1"
      }
    },
    "http://example.com/friend1"
  );
  // Prints friend 1
  console.log(friend1.friend.friend.friend.friend.friend.friend.friend.friend.friend.friend);
}
run();
```

## Known Limitations
 - This library doesn't consider named graphs
