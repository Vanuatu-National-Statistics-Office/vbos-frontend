import { Switch } from "@chakra-ui/react";
import { useLayerStore } from "@/store/layer-store";

type LayerSwitchProps = {
  title: string;
  id: number;
  dataType: "raster" | "vector" | "tabular";
};

const LayerSwitch = ({ title, id, dataType }: LayerSwitchProps) => {
  const { layers, switchLayer } = useLayerStore();
  const urlLayerId = `${dataType.substr(0, 1)}${id}`;

  return (
    <Switch.Root
      size="sm"
      colorPalette="blue"
      checked={layers.split(",").includes(urlLayerId)}
      onCheckedChange={() => switchLayer(urlLayerId)}
    >
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label fontWeight="normal">{title}</Switch.Label>
    </Switch.Root>
  );
};

export { LayerSwitch };
