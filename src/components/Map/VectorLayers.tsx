import { Layer, Source, LayerProps } from "react-map-gl/maplibre";
import { useLayerStore } from "@/store/layer-store";
import { useOpacityStore } from "@/store/opacity-store";
import { useDataset } from "@/hooks/useDataset";
import { PaginatedVectorData } from "@/types/api";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useAreaStore } from "@/store/area-store";
import { getVectorLayerColor } from "@/utils/getVectorLayerColor";

export function VectorLayers() {
  const { layers } = useLayerStore();
  const vectorLayers = layers
    .split(",")
    .filter((i) => i.startsWith("v"))
    .map((i) => Number(i.slice(1)));

  return (
    <>
      {vectorLayers.map((layer) => (
        <VectorMapLayer id={layer} key={layer} />
      ))}
    </>
  );
}

type VectorMapLayerProps = {
  id: number;
};

function VectorMapLayer({ id }: VectorMapLayerProps) {
  const layerId = `v${id}`;
  const { getOpacity } = useOpacityStore();

  // load ac and province and set filters
  const { ac, province } = useAreaStore();
  const filters = new URLSearchParams();
  if (ac) filters.set("area_council", ac);
  if (province) filters.set("province", province);

  const { data, isPending, error } = useDataset("vector", id, filters);

  if (error) return null;
  if (isPending)
    return (
      <Box
        position="relative"
        display="inline-block"
        p={2}
        m={1}
        opacity={0.8}
        bgColor="white"
      >
        <Spinner size="sm" />
        <Text display="inline" pl={1}>
          Loading dataset layer {id}
        </Text>
      </Box>
    );

  // Get opacity from store (0-100) and convert to 0-1 for MapLibre
  const opacity = getOpacity(layerId) / 100;

  // Get consistent color for this layer based on ID
  const layerColor = getVectorLayerColor(id);

  const lineStyle: LayerProps = {
    type: "line",
    paint: {
      "line-color": layerColor,
      "line-opacity": opacity,
    },
    source: layerId,
  };
  const pointStyle: LayerProps = {
    type: "circle",
    paint: {
      "circle-color": layerColor,
      "circle-opacity": opacity,
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 2, 15, 8],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1,
      "circle-stroke-opacity": opacity * 0.7,
    },
    source: layerId,
    filter: ["==", ["geometry-type"], "Point"],
  };

  if (data) {
    return (
      <Source id={layerId} type="geojson" data={data as PaginatedVectorData}>
        <Layer {...lineStyle} />
        <Layer {...pointStyle} />
      </Source>
    );
  }
}
