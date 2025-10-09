export interface IListApiReponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Cluster {
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
  type: string;
  source: string | null;
  unit: string | null;
}

export interface TabularDataset extends BaseDataset {
  dataType: "tabular";
}

export interface RasterDataset extends BaseDataset {
  dataType: "raster";
}

export type Dataset = TabularDataset | RasterDataset;

export interface ClusterWithDatasets {
  id: number;
  name: string;
  description?: string;
  datasets: Dataset[];
}
