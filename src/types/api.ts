import { Feature } from "geojson";

export interface IListApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ICluster {
  id: number;
  name: string;
  description?: string;
}

export interface BaseDataset {
  id: number;
  name: string;
  created: string;
  updated: string;
  cluster: string; // Cluster name, not ID
  type: DatasetType;
  source: string | null;
  unit: string | null;
}

// Raw API response types before adding dataType discriminator
export type RawTabularDataset = BaseDataset;

export interface RawRasterDataset extends BaseDataset {
  file: string;
}

export type RawVectorDataset = BaseDataset;

export interface TabularDataset extends BaseDataset {
  dataType: "tabular";
}

export interface RasterDataset extends BaseDataset {
  dataType: "raster";
  file: string; // URL to the raster file (e.g., TIFF)
}

export interface VectorDataset extends BaseDataset {
  dataType: "vector";
}

export type Dataset = TabularDataset | RasterDataset | VectorDataset;

export interface ClusterDatasets {
  type: DatasetType;
  datasets: Dataset[];
}

export type DatasetType =
  | "baseline"
  | "estimated_damage"
  | "aid_resources_needed"
  | "estimate_financial_damage";

export interface TabularData {
  id: number;
  attribute: string;
  date: string;
  value: number;
  province?: string;
  area_council?: string;
}

export interface PaginatedVectorData {
  count: number;
  next: string | null;
  previous: string | null;
  type: "FeatureCollection";
  features: Feature[];
}
