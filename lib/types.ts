import { ContextDefinition } from "jsonld";

export type Context =
  | (null | string | ContextDefinition)
  | (null | string | ContextDefinition)[];

export type OrArray<T> = T | T[];
