import { useDateStore } from "@/store/date-store";
import { useLayerStore } from "@/store/layer-store";
import { Box } from "@chakra-ui/react";

export function Stats() {
  const { tabularLayerData } = useLayerStore();
  const { year } = useDateStore();
  const filteredData = tabularLayerData.filter((i) => i.date.startsWith(year));

  if (filteredData.length === 0) {
    return <Box pt={4}>No data for this time and place selection.</Box>;
  }

  return (
    <Box pt={4}>The dataset contains {tabularLayerData.length} items.</Box>
  );
}
