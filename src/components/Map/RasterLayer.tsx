import { Layer, Source, LayerProps } from "react-map-gl/maplibre";
import { useLayerStore } from "@/store/layer-store";
import { useOpacityStore } from "@/store/opacity-store";
import { useDateStore } from "@/store/date-store";

export function RasterLayers() {
  const { layers } = useLayerStore();
  const vectorLayers = layers
    .split(",")
    .filter((i) => i.startsWith("r"))
    .map((i) => Number(i.slice(1)));

  return (
    <>
      {vectorLayers.map((layer) => (
        <RasterMapLayer id={layer} key={layer} />
      ))}
    </>
  );
}

type RasterMapLayerProps = {
  id: number;
};

function RasterMapLayer({ id }: RasterMapLayerProps) {
  const layerId = `r${id}`;
  const { getOpacity } = useOpacityStore();
  const { year } = useDateStore();
  // Get opacity from store (0-100) and convert to 0-1 for MapLibre
  const opacity = getOpacity(layerId) / 100;
  const layerStyle: LayerProps = {
    type: "raster",
    paint: {
      "raster-opacity": opacity,
    },
  };

  return (
    <Source
      id={layerId}
      type="raster"
      tileSize={256}
      tiles={[
        `https://vbos-titiler.ds.io/dataset/nbgi_clipped/years/${year || "2024"}/tiles/WebMercatorQuad/{z}/{x}/{y}.png?rescale=-0.3,0.3`,
      ]}
    >
      <Layer id={layerId} source={layerId} {...layerStyle} />
    </Source>
  );
}
