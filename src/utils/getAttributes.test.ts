import { expect, test } from "vitest";
import {
  getAreaCouncilAttributeValueSum,
  getAttributes,
  getAttributeValueSum,
  getProvinceAttributeValueSum,
} from "./getAttributes";
import * as tabularData from "./fixtures/tabularData.json";

test("getAttributes returns the correct value", () => {
  expect(getAttributes(tabularData.results)).toEqual([
    "ecce",
    "primary",
    "secondary",
  ]);
});

test("getAttributeValueSum returns the correct value", () => {
  expect(getAttributeValueSum(tabularData.results, "ecce")).toEqual(760);
  expect(getAttributeValueSum(tabularData.results, "primary")).toEqual(592);
});

test("getProvinceAttributeValueSum returns the correct value", () => {
  expect(
    getProvinceAttributeValueSum(tabularData.results, "TAFEA", "ecce"),
  ).toEqual(113);
  expect(
    getProvinceAttributeValueSum(tabularData.results, "MALAMPA", "primary"),
  ).toEqual(24);
});

test("getAreaCouncilAttributeValueSum returns the correct value", () => {
  expect(
    getAreaCouncilAttributeValueSum(
      tabularData.results,
      "North West Malekula",
      "ecce",
    ),
  ).toEqual(4);
  expect(
    getAreaCouncilAttributeValueSum(
      tabularData.results,
      "North West Malekula",
      "primary",
    ),
  ).toEqual(3);
});
