import { useState } from "react";
import {
  Box,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuChartLine, LuCircleX, LuList } from "react-icons/lu";
import { useDateStore } from "@/store/date-store";
import { useLayerStore } from "@/store/layer-store";
import { DATASET_TYPES } from "@/utils/datasetTypes";
import { Dataset } from "@/types/api";
import { getAttributes, getAttributeValueSum } from "@/utils/getAttributes";
import { StatsChart } from "./StatsChart";
import { StatsTable } from "./StatsTable";

export function Stats() {
  const [visMode, setVisMode] = useState<"chart" | "table">("chart");
  const { layers, tabularLayerData, getLayerMetadata, switchLayer } =
    useLayerStore();
  const { year } = useDateStore();
  const filteredData = tabularLayerData.filter((i) => i.date.startsWith(year));
  const tabularLayerId = layers.split(",").find((i) => i.startsWith("t"));
  const layerMetadata: Dataset | undefined = tabularLayerId
    ? getLayerMetadata(tabularLayerId)
    : undefined;
  const attributes = getAttributes(filteredData);

  if (!tabularLayerId) {
    return null;
  }

  // this is not a very reliable way to check if the data is still loading,
  //  but it's what we have now
  if (tabularLayerData.length === 0 && filteredData.length === 0) {
    return (
      <Stack gap={4} py={2} overflowY="scroll">
        <Stack px={4}>
          <Skeleton height={12} />
        </Stack>
        <Stack gap={3} px={4}>
          <Skeleton height={10} />
        </Stack>
      </Stack>
    );
  }

  if (filteredData.length === 0) {
    return <Box pt={4}>No data for this year and administrative area.</Box>;
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
              onClick={() => setVisMode("chart")}
            >
              <LuChartLine />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => setVisMode("table")}
            >
              <LuList />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              onClick={() => switchLayer(tabularLayerId)}
            >
              <LuCircleX />
            </IconButton>
          </Box>
        </Box>
        <Box display="block">
          <HStack gap="3" width="100%" px="2">
            {attributes.map((attr: string) => (
              <Box flex="1" textAlign="center">
                <Text
                  fontSize="md"
                  textTransform="uppercase"
                  fontWeight="500"
                  display="block"
                >
                  {attr}
                </Text>
                <Text fontSize="md" display="block">
                  {getAttributeValueSum(filteredData, attr)}
                </Text>
              </Box>
            ))}
          </HStack>
          {visMode === "chart" && <StatsChart stats={filteredData} />}
          {visMode === "table" && <StatsTable stats={filteredData} />}
        </Box>
      </Box>
    );
  }
}
