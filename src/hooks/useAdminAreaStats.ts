import { useAreaStore } from "@/store/area-store";
import { useDateStore } from "@/store/date-store";
import { useLayerStore } from "@/store/layer-store";
import { AreaCouncilGeoJSON, ProvincesGeoJSON } from "@/types/data";
import { getAreaCouncilValue, getProvinceValue } from "@/utils/getValue";

const useAdminAreaStats = (geojson: ProvincesGeoJSON | AreaCouncilGeoJSON) => {
  const { province } = useAreaStore();
  const { tabularLayerData } = useLayerStore();
  const { year } = useDateStore();
  const filteredData = tabularLayerData.filter((i) => i.date.startsWith(year));

  if (!tabularLayerData) {
    return { geojson, maxValue: 0, minValue: 0 };
  }

  if (!province) {
    geojson.features.forEach(
      (p) =>
        (p.properties.value = getProvinceValue(
          filteredData,
          p.properties.name,
        )),
    );
  }
  if (province) {
    geojson.features.forEach(
      (c) =>
        (c.properties.value = getAreaCouncilValue(
          filteredData,
          c.properties.name,
        )),
    );
  }

  const values = geojson.features
    .map((i) => i.properties?.value)
    .filter((v): v is number => typeof v === "number" && isFinite(v));

  if (values.length === 0) {
    return { geojson, maxValue: 0, minValue: 0 };
  }

  values.sort((a, b) => a - b);
  const minValue = values[0];
  const maxValue = values[values.length - 1];

  return { geojson, maxValue, minValue };
};

export { useAdminAreaStats };
