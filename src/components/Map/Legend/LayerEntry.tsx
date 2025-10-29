/**
 * LayerEntry component renders a single layer's legend information.
 *
 * Displays layer name, visualization style, and provides controls for
 * toggling visibility or removing the layer from the map.
 */

import { useState } from "react";
import {
  Box,
  Text,
  IconButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { LuX, LuInfo, LuDroplet } from "react-icons/lu";
import { OpacityControl } from "./OpacityControl";
import { LayerInfoModal } from "./LayerInfoModal";

import type {
  LegendLayer,
  TabularLegendLayer,
  VectorLegendLayer,
  RasterLegendLayer,
} from "./types";

/**
 * Props for the LayerEntry component.
 */
type LayerEntryProps = LegendLayer & {
  switchLayer: (layerId: string) => void;
  setOpacity: (layerId: string, opacity: number) => void;
}

/**
 * Main LayerEntry component that delegates to specific layer type renderers.
 */
export function LayerEntry(props: LayerEntryProps) {
  const { dataType, id, name, switchLayer, setOpacity: setOpacityStore } = props;
  const [infoOpen, setInfoOpen] = useState(false);
  const [opacity, setOpacity] = useState(100);

  const layerId = `${dataType.charAt(0)}${id}`;

  const handleRemove = () => {
    switchLayer(layerId);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    setOpacityStore(layerId, newOpacity);
  };

  return (
    <>
      <VStack w="100%" align="flex-start" gap={2}>
        <HStack w="full">
          <Text fontWeight="medium" fontSize="sm" lineClamp={1} mr="auto">
            {name}
          </Text>
          {/* Control buttons */}
          <HStack gap={0} flexShrink={0}>
            {/* Info button */}
            <Tooltip content="Layer info" positioning={{ placement: "top" }}>
              <IconButton
                aria-label="Layer info"
                size="xs"
                variant="ghost"
                onClick={() => setInfoOpen(true)}
              >
                <LuInfo />
              </IconButton>
            </Tooltip>

            {/* Opacity control */}
            <OpacityControl value={opacity} onValueChange={handleOpacityChange}>
              <IconButton
                aria-label="Adjust opacity"
                size="xs"
                variant="ghost"
              >
                <LuDroplet />
              </IconButton>
            </OpacityControl>

            {/* Remove button */}
            <Tooltip content="Remove layer" positioning={{ placement: "top" }}>
              <IconButton
                aria-label="Remove layer"
                size="xs"
                variant="ghost"
                onClick={handleRemove}
              >
                <LuX />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>
        <Box flex={1} minW={0} w="full">
          {dataType === "tabular" && <TabularEntry {...(props as TabularLegendLayer)} />}
          {dataType === "vector" && <VectorEntry {...(props as VectorLegendLayer)} />}
          {dataType === "raster" && <RasterEntry {...(props as RasterLegendLayer)} />}
        </Box>
      </VStack>

      {/* Info modal */}
      <LayerInfoModal
        layer={props}
        open={infoOpen}
        onOpenChange={setInfoOpen}
      />
    </>
  );
}

/**
 * Renders legend information for a tabular (choropleth) layer.
 * Shows a color ramp matching the map's choropleth visualization.
 */
function TabularEntry(props: TabularLegendLayer) {
  const { unit, dataRange } = props;

  // Choropleth color from AdminAreaLayers.tsx
  const baseColor = "#8856a7"; // Purple used in the map

  return (
    <VStack align="stretch" gap={2} w="100%">
      {dataRange ? (
        <VStack align="stretch" gap={1} w="100%">
          {/* Color ramp bar */}
          <Box
            h="16px"
            w="100%"
            position="relative"
            overflow="hidden"
            bgGradient="to-r"
            gradientFrom="transparent"
            gradientTo={baseColor}
          />
          {/* Min/Max labels */}
          <HStack justify="space-between" fontSize="xs" color="fg.muted">
            <Text>{dataRange.min.toLocaleString()}{unit ? ` ${unit}` : ""}</Text>
            <Text textAlign="right">{dataRange.max.toLocaleString()}{unit ? ` ${unit}` : ""}</Text>
          </HStack>
        </VStack>
      ) : (
        /* Show placeholder when data is loading */
        <VStack align="stretch" gap={1} w="100%">
          <Box
            h="16px"
            w="100%"
            rounded="sm"
            bg="gray.100"
            opacity={0.5}
          />
          <Text fontSize="xs" color="fg.muted" fontStyle="italic">
            Loading data...
          </Text>
        </VStack>
      )}

      {!dataRange && unit && (
        <Text fontSize="xs" color="fg.muted">
          Unit: {unit}
        </Text>
      )}
    </VStack>
  );
}

/**
 * Renders legend information for a vector layer.
 * Shows line or circle symbology matching the map visualization.
 */
function VectorEntry(props: VectorLegendLayer) {
  const { name, geometryType, color, unit } = props;
  const isPoint = geometryType.includes("Point");
  const isLine = geometryType.includes("Line");

  return (
    <VStack align="stretch" gap={2} w="100%">
      {/* Symbology */}
      <HStack gap={2} align="center">
        {isPoint && (
          <>
            <Box
              w="12px"
              h="12px"
              rounded="full"
              bg={color}
              flexShrink={0}
            />
            <Text fontSize="xs" color="fg.muted">{name}</Text>
          </>
        )}
        {isLine && (
          <>
            <Box
              w="12px"
              h="3px"
              bg={color}
              flexShrink={0}
              rounded="full"
            />
            <Text fontSize="xs" color="fg.muted">{name}</Text>
          </>
        )}
        {!isPoint && !isLine && (
          <>
            <Box
              w="16px"
              h="12px"
              border="2px solid"
              borderColor={color}
              bg={`${color}33`}
              flexShrink={0}
              rounded="sm"
            />
            <Text fontSize="xs" color="fg.muted">{geometryType}</Text>
          </>
        )}
      </HStack>

      {unit && (
        <Text fontSize="xs" color="fg.muted">
          Unit: {unit}
        </Text>
      )}
    </VStack>
  );
}

/**
 * Renders legend information for a raster layer.
 */
function RasterEntry(props: RasterLegendLayer) {
  const { unit, opacity } = props;

  return (
    <VStack align="stretch" gap={1}>
      {unit && (
        <Text fontSize="xs" color="fg.muted" pl={6}>
          Unit: {unit}
        </Text>
      )}
      {opacity !== undefined && (
        <Text fontSize="xs" color="fg.muted" pl={6}>
          Opacity: {Math.round(opacity * 100)}%
        </Text>
      )}
    </VStack>
  );
}
