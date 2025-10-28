/**
 * LayerEntry component renders a single layer's legend information.
 *
 * Displays layer name, visualization style, and provides controls for
 * toggling visibility or removing the layer from the map.
 */

import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/Tooltip";
import { LuX } from "react-icons/lu";

import type {
  LegendLayer,
  LayerActionHandler,
  TabularLegendLayer,
  VectorLegendLayer,
  RasterLegendLayer,
} from "./types";

/**
 * Props for the LayerEntry component.
 */
type LayerEntryProps = LegendLayer & {
  /** Callback for layer actions (toggle, remove) */
  onLayerAction?: LayerActionHandler;
};

/**
 * Main LayerEntry component that delegates to specific layer type renderers.
 */
export function LayerEntry(props: LayerEntryProps) {
  const { dataType, onLayerAction } = props;

  const handleRemove = () => {
    onLayerAction?.({
      action: "remove",
      payload: { layer: props },
    });
  };

  return (
    <Flex w="100%" align="flex-start" gap={2} position="relative">
      <Box flex={1} minW={0}>
        {dataType === "tabular" && <TabularEntry {...(props as TabularLegendLayer)} />}
        {dataType === "vector" && <VectorEntry {...(props as VectorLegendLayer)} />}
        {dataType === "raster" && <RasterEntry {...(props as RasterLegendLayer)} />}
      </Box>
      <Tooltip content="Remove layer" positioning={{ placement: "left" }}>
        <IconButton
          aria-label="Remove layer"
          size="xs"
          variant="plain"
          onClick={handleRemove}
          flexShrink={0}
          position="absolute"
          top={-1}
          right={-2}
        >
          <LuX />
        </IconButton>
      </Tooltip>
    </Flex>
  );
}

/**
 * Renders legend information for a tabular (choropleth) layer.
 * Shows a color ramp matching the map's choropleth visualization.
 */
function TabularEntry(props: TabularLegendLayer) {
  const { name, unit, dataRange } = props;

  // Choropleth color from AdminAreaLayers.tsx
  const baseColor = "#8856a7"; // Purple used in the map

  return (
    <VStack align="stretch" gap={2} w="100%">
      <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
        {name}
      </Text>
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
      <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
        {name}
      </Text>

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
              w="32px"
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
  const { name, unit, opacity } = props;

  return (
    <VStack align="stretch" gap={1}>
      <Text fontWeight="medium" fontSize="sm" lineClamp={1}>
        {name}
      </Text>
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
