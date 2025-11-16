import { TabularData } from "@/types/api";

export function getYears(items: TabularData[]): number[] {
  const years = items.map((i: TabularData) =>
    new Date(i.date).getUTCFullYear(),
  );
  return [...new Set(years)];
}
