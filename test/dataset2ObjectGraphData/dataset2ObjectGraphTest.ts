import { NodeObject } from "jsonld";

export default interface dataset2ObjectGraphTest {
  name: string;
  testData: NodeObject;
  testFrame: NodeObject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect: (resultingObject: any) => Promise<void>;
}
