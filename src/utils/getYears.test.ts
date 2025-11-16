import { expect, test } from "vitest";
import * as tabularData from "./fixtures/tabularData.json";
import { getYears } from "./getYears";

test("getYears returns the correct values", () => {
  expect(getYears(tabularData.results)).toEqual([2023]);
});
