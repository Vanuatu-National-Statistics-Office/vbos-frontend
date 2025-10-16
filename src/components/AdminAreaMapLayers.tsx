import { Layer, Source, LayerProps } from "react-map-gl/maplibre";
import useProvinces from "@/hooks/useProvinces";
import { useAreaStore } from "@/store/area-store";

export function AdminAreaMapLayers() {
  const { data: provincesGeojson, isPending, error } = useProvinces();
  const { ac, province, acGeoJSON } = useAreaStore();

  if (isPending || error) {
    return null;
  }

  const provinceLayerStyle: LayerProps = {
    type: "line",
    paint: { "line-color": "#198EC8" },
    source: "provinces",
    filter: province ? ["==", "name", province.toUpperCase()] : ["all"],
  };
  const areaCouncilLayerStyle: LayerProps = {
    type: "line",
    paint: { "line-color": "#374140" },
    source: "area-councils",
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
    </>
  );
}
