import { Layer, Source, LayerProps } from "react-map-gl/maplibre";
import useProvinces from "@/hooks/useProvinces";
import { useAreaStore } from "@/store/area-store";
import { useAdminAreaStats } from "@/hooks/useAdminAreaStats";
import { featureCollection } from "@turf/helpers";

export function AdminAreaMapLayers() {
  const { data: provincesGeojson, isPending, error } = useProvinces();
  const { ac, province, acGeoJSON } = useAreaStore();
  const {
    geojson: adminAreaStatsGeojson,
    maxValue,
    minValue,
  } = useAdminAreaStats(
    province ? acGeoJSON : provincesGeojson || featureCollection([]),
  );

  if (isPending || error) {
    return null;
  }

  const provinceLayerStyle: LayerProps = {
    type: "line",
    paint: {
      "line-color": "#198EC8",
      "line-width": ac ? 1 : 2,
      "line-opacity": ac ? 0.5 : 1,
    },
    source: "provinces",
    filter: province ? ["==", "name", province.toUpperCase()] : ["all"],
  };
  const areaCouncilLayerStyle: LayerProps = {
    type: "line",
    paint: {
      "line-color": "#198EC8",
      "line-width": ac ? 2 : 1,
      "line-opacity": ac ? 1 : 0.125,
    },
    source: "area-councils",
    filter: ac ? ["==", "name", ac] : ["all"],
  };
  const fillStyle: LayerProps = {
    type: "fill",
    paint: {
      "fill-color": "#8856a7",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "value"],
        minValue,
        0.1,
        maxValue,
        1,
      ],
    },
    source: "stats",
    filter: ac ? ["==", "name", ac] : ["all"],
  };

  return (
    <>
      {acGeoJSON && (
        <Source id="area-councils" type="geojson" data={acGeoJSON}>
          <Layer {...areaCouncilLayerStyle} />
        </Source>
      )}
      {provincesGeojson && (
        <Source id="provinces" type="geojson" data={provincesGeojson}>
          <Layer {...provinceLayerStyle} />
        </Source>
      )}
      {adminAreaStatsGeojson && maxValue > 0 && (
        <Source id="stats" type="geojson" data={adminAreaStatsGeojson}>
          <Layer {...fillStyle} />
        </Source>
      )}
    </>
  );
}
