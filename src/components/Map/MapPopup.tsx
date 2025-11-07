import { Popup } from "react-map-gl/maplibre";
import "@/Theme/popup.css";
import { DataList, Heading } from "@chakra-ui/react";
import { toSentenceCase } from "@/utils/format";
import { PopupInfo } from "./index";

export function MapPopup(popupInfo: PopupInfo) {
  return (
    <Popup
      latitude={popupInfo.latitude}
      longitude={popupInfo.longitude}
      offset={[0, -10]}
      closeButton={false}
      style={{ fontFamily: "var(--chakra-fonts-body)" }}
    >
      {popupInfo.datasetName && (
        <Heading size="xs" as="span" mb={2}>
          {popupInfo.datasetName}
        </Heading>
      )}
      <DataList.Root
        orientation="horizontal"
        divideY="1px"
        size="sm"
        maxW="sm"
        gap={2}
      >
        {Object.entries(popupInfo.properties).map(([key, value]) => (
          <DataList.Item
            alignItems="baseline"
            key={key}
            _notFirst={{ pt: "2" }}
          >
            <DataList.ItemLabel minW="5rem">
              {toSentenceCase(key)}
            </DataList.ItemLabel>
            <DataList.ItemValue maxW="100%" display="inline-block">
              {value !== null && value !== undefined ? String(value) : "N/A"}
            </DataList.ItemValue>
          </DataList.Item>
        ))}
      </DataList.Root>
    </Popup>
  );
}
