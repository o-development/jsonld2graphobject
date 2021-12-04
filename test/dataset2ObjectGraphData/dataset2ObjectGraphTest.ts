import { NodeObject } from "jsonld";

export default interface dataset2ObjectGraphTest {
  name: string;
  testData: NodeObject;
  testNode: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect: (resultingObject: any) => Promise<void>;
}
