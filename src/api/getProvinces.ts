import * as HTTP from "./http";
import { ProvinceFeature } from "@/types/data";
import { FeatureCollection, Geometry } from "geojson";

type Provinces = FeatureCollection<Geometry, ProvinceFeature>;

export function getProvinces(): Promise<Provinces> {
  return HTTP.get("/api/v1/provinces/").then((r) => {
    if (!r.ok) throw new Error("Unable to get provinces.");
    return r.json();
  });
}
