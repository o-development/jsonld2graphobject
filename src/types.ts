import { ContextDefinition } from "jsonld";

export type Context =
  | (null | string | ContextDefinition)
  | (null | string | ContextDefinition)[];
