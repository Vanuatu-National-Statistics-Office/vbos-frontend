import { Box, IconButton, Text } from "@chakra-ui/react";
import { LuCircleX } from "react-icons/lu";
import { useDateStore } from "@/store/date-store";
import { useLayerStore } from "@/store/layer-store";
import { DATASET_TYPES } from "@/utils/datasetTypes";
import { Dataset } from "@/types/api";

export function Stats() {
  const { layers, tabularLayerData, getLayerMetadata, switchLayer } =
    useLayerStore();
  const { year } = useDateStore();
  const filteredData = tabularLayerData.filter((i) => i.date.startsWith(year));
  const tabularLayerId = layers.split(",").find((i) => i.startsWith("t"));
  const layerMetadata: Dataset | undefined = tabularLayerId
    ? getLayerMetadata(tabularLayerId)
    : undefined;

  if (!tabularLayerId) {
    return <Box pt={4}>No tabular layer data active.</Box>;
  }

  if (filteredData.length === 0) {
    return <Box pt={4}>No data for this time and place selection.</Box>;
  }

  if (layerMetadata) {
    return (
      <Box mt={4} borderColor="black.700" borderWidth={2} borderRadius={5}>
        <Box
          backgroundColor="gray.100"
          px={2}
          py={3}
          display="flex"
          alignItems="center"
        >
          <Box flex="1">
            <Text display="block" fontSize="xs" color="gray.600">
              {layerMetadata.cluster} | {DATASET_TYPES[layerMetadata.type]}
            </Text>
            <Text display="block">{layerMetadata.name}</Text>
          </Box>
          <Box display="flex" flexDirection="row">
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => switchLayer(tabularLayerId)}
            >
              <LuCircleX />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }
}
