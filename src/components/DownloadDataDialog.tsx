import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuDownload } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import { useLayerStore } from "@/store/layer-store";
import { useAreaStore } from "@/store/area-store";
import {
  downloadTabularDataset,
  downloadVectorDatasetFromCache,
} from "@/api/downloadDataset";
import { Dataset, PaginatedVectorData } from "@/types/api";
import { downloadFile, sanitizeFilename } from "@/utils/downloadHelpers";

type DownloadDataDialogProps = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
};

export const DownloadDataDialog = ({
  isOpen,
  setIsOpen,
}: DownloadDataDialogProps) => {
  const { layers, getLayerMetadata } = useLayerStore();
  const { province, ac } = useAreaStore();
  const queryClient = useQueryClient();
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  // Parse active layers from the layers string (format: "t1,v34,r54")
  const activeLayers = layers ? layers.split(",") : [];

  // Get metadata for each active layer
  const activeDatasets = activeLayers
    .map((layerId) => {
      const metadata = getLayerMetadata(layerId);
      return metadata ? { layerId, metadata } : null;
    })
    .filter((item): item is { layerId: string; metadata: Dataset } => item !== null);

  // Group datasets by type
  const groupedDatasets = {
    tabular: activeDatasets.filter((d) => d.layerId.startsWith("t")),
    raster: activeDatasets.filter((d) => d.layerId.startsWith("r")),
    vector: activeDatasets.filter((d) => d.layerId.startsWith("v")),
  };

  const handleDownload = async (layerId: string, dataset: Dataset) => {
    // Mark this dataset as downloading
    setDownloadingIds((prev) => new Set(prev).add(layerId));

    try {
      // Build area filters (province and ac only)
      // Note: Date/year filtering is not used for downloads - we download the full dataset
      const areaFilters = new URLSearchParams();
      if (province) areaFilters.set("province", province);
      if (ac) areaFilters.set("area_council", ac);

      let result;

      if (dataset.dataType === "tabular") {
        // Use the dedicated XLSX endpoint for tabular data
        // Downloads full dataset filtered only by area
        result = await downloadTabularDataset(dataset.id, areaFilters);
      } else if (dataset.dataType === "vector") {
        // Get cached data from queryClient
        const queryKey = [
          "dataset",
          "vector",
          dataset.id,
          areaFilters.toString(),
        ];
        const cachedData = queryClient.getQueryData<PaginatedVectorData>(queryKey);

        if (!cachedData) {
          throw new Error("Vector data not available. Please ensure the layer is loaded on the map first.");
        }

        result = downloadVectorDatasetFromCache(cachedData);
      } else {
        // Raster datasets - download directly from the file URL
        if (!dataset.file) {
          throw new Error("Raster file URL not available.");
        }

        // Open the file URL in a new tab to trigger download
        window.open(dataset.file, "_blank");
        return;
      }

      // Generate filename with area context: DatasetName_Province_AC.ext
      const sanitizedName = sanitizeFilename(dataset.name);
      const filenameParts = [sanitizedName];

      if (province) filenameParts.push(sanitizeFilename(province));
      if (ac) filenameParts.push(sanitizeFilename(ac));

      const filename = `${filenameParts.join("_")}.${result.extension}`;

      // Trigger the download
      downloadFile(result.blob, filename);
    } catch (error) {
      // Error occurred during download
      const message = error instanceof Error ? error.message : "Failed to download dataset. Please try again.";
      alert(message);
    } finally {
      // Remove from downloading set
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(layerId);
        return next;
      });
    }
  };

  return (
    <Dialog.Root
      lazyMount
      size="md"
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Download Active Datasets</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {activeDatasets.length === 0 ? (
                <Text color="gray.600">
                  No active datasets. Please enable some datasets from the left
                  sidebar to download them.
                </Text>
              ) : (
                <Flex direction="column" gap={4}>
                  {groupedDatasets.tabular.length > 0 && (
                    <Box>
                      <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
                        Tabular Datasets
                      </Text>
                      <Flex direction="column" gap={2}>
                        {groupedDatasets.tabular.map(({ layerId, metadata }) => (
                          <DatasetRow
                            key={layerId}
                            layerId={layerId}
                            dataset={metadata}
                            onDownload={handleDownload}
                            isDownloading={downloadingIds.has(layerId)}
                          />
                        ))}
                      </Flex>
                    </Box>
                  )}

                  {groupedDatasets.raster.length > 0 && (
                    <Box>
                      <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
                        Raster Datasets
                      </Text>
                      <Flex direction="column" gap={2}>
                        {groupedDatasets.raster.map(({ layerId, metadata }) => (
                          <DatasetRow
                            key={layerId}
                            layerId={layerId}
                            dataset={metadata}
                            onDownload={handleDownload}
                            isDownloading={downloadingIds.has(layerId)}
                          />
                        ))}
                      </Flex>
                    </Box>
                  )}

                  {groupedDatasets.vector.length > 0 && (
                    <Box>
                      <Text fontWeight="600" mb={2} fontSize="sm" color="gray.700">
                        Vector Datasets
                      </Text>
                      <Flex direction="column" gap={2}>
                        {groupedDatasets.vector.map(({ layerId, metadata }) => (
                          <DatasetRow
                            key={layerId}
                            layerId={layerId}
                            dataset={metadata}
                            onDownload={handleDownload}
                            isDownloading={downloadingIds.has(layerId)}
                          />
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Flex>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

type DatasetRowProps = {
  layerId: string;
  dataset: Dataset;
  onDownload: (layerId: string, dataset: Dataset) => void;
  isDownloading: boolean;
};

const DatasetRow = ({
  layerId,
  dataset,
  onDownload,
  isDownloading,
}: DatasetRowProps) => {
  // Determine file format based on dataset type
  const getFileFormat = () => {
    if (dataset.dataType === "tabular") return "XLSX";
    if (dataset.dataType === "vector") return "GeoJSON";
    // Raster files - extract extension from file URL if available
    if (dataset.dataType === "raster" && dataset.file) {
      const extension = dataset.file.split(".").pop()?.toUpperCase();
      return extension || "File";
    }
    return "File"; // raster without file URL
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      p={3}
      bg="gray.50"
      borderRadius="md"
      borderWidth={1}
      borderColor="gray.200"
    >
      <Box flex={1}>
        <Text fontWeight="500" fontSize="sm">
          {dataset.name}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {dataset.type.replace(/_/g, " ").replace(/\b\w/g, (char, index) =>
            index === 0 ? char.toUpperCase() : char.toLowerCase()
          )} • {getFileFormat()}
        </Text>
      </Box>
      <Button
        size="sm"
        colorPalette="blue"
        variant="outline"
        onClick={() => onDownload(layerId, dataset)}
        disabled={isDownloading}
        loading={isDownloading}
      >
        <LuDownload />
        Download
      </Button>
    </Flex>
  );
};
