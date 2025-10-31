import { TabularData } from "@/types/api";
import { getAttributes } from "./getAttributes";

type TimeSeriesDataPoint = {
  [key: string]: number | string;
  date: string;
  year: string;
};

/**
 * Consolidates tabular data into time series format for line charts.
 * Groups data by year and calculates the sum of each attribute for that year.
 *
 * Note: The data should already be filtered by administrative area before
 * being passed to this function (e.g., via API filters).
 *
 * @param data - Array of TabularData to consolidate (pre-filtered by area if needed)
 * @returns Array of data points with year as x-axis and attributes as y-axis values
 *
 * @example
 * // Returns: [{ year: "2020", date: "2020-01-01", ecce: 1000, primary: 800 }, ...]
 * consolidateTimeSeries(data)
 */
export function consolidateTimeSeries(
  data: TabularData[],
): TimeSeriesDataPoint[] {
  const filteredData = data;

  // Group data by year
  const yearMap = new Map<string, TabularData[]>();
  filteredData.forEach((item) => {
    // Extract year from date (format: "2024-01-01")
    const year = item.date.split("-")[0];
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(item);
  });

  // Get all unique attributes
  const attributes = getAttributes(filteredData);

  // Build time series data points
  const timeSeries: TimeSeriesDataPoint[] = [];

  // Sort years chronologically
  const sortedYears = Array.from(yearMap.keys()).sort();

  sortedYears.forEach((year) => {
    const yearData = yearMap.get(year)!;
    const dataPoint: TimeSeriesDataPoint = {
      year,
      date: `${year}-01-01`, // Use first day of year for consistency
    };

    // Calculate sum for each attribute in this year
    attributes.forEach((attr) => {
      const sum = yearData
        .filter((item) => item.attribute === attr)
        .reduce((total, item) => total + (item.value || 0), 0);
      dataPoint[attr] = sum;
    });

    timeSeries.push(dataPoint);
  });

  return timeSeries;
}
