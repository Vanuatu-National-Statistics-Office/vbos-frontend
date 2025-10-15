import * as HTTP from "./http";
import { AreaCouncilFeature } from "@/types/data";
import { FeatureCollection, Geometry } from "geojson";

export function getAreaCouncils(
  province: string,
): Promise<FeatureCollection<Geometry, AreaCouncilFeature>> {
  return HTTP.get(`/api/v1/provinces/${province}/area-councils/`).then((r) => {
    if (!r.ok) throw new Error("Unable to get area councils.");
    return r.json();
  });
}
