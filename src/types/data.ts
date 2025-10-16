import { FeatureCollection, Geometry } from "geojson";

export type ProvinceFeature = {
  name: string;
};

export type AreaCouncilFeature = {
  name: string;
  province: number;
};

export type ProvincesGeoJSON = FeatureCollection<Geometry, ProvinceFeature>;

export type AreaCouncilGeoJSON = FeatureCollection<
  Geometry,
  AreaCouncilFeature
>;
