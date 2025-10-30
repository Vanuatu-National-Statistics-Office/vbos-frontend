import { expect, test } from "vitest";
import * as tabularData from "./fixtures/tabularData.json";
import { consolidateStats } from "./consolidateStats";

test("consolidateStats", () => {
  expect(consolidateStats(tabularData.results, "province")).toEqual([
    { place: "MALAMPA", ecce: 35, primary: 24, secondary: 7 },
    { place: "SHEFA", ecce: 133, primary: 132, secondary: 57 },
    { place: "TAFEA", ecce: 113, primary: 75, secondary: 24 },
  ]);
});
