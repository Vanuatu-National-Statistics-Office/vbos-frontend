import { useLayerStore } from "@/store/layer-store";
import { Box } from "@chakra-ui/react";

export function Stats() {
  const { tabularLayerData } = useLayerStore();

  if (tabularLayerData.length === 0) return null;

  return (
    <Box pt={4}>The dataset contains {tabularLayerData.length} items.</Box>
  );
}
