import { Switch } from "@chakra-ui/react";

type LayerSwitchProps = {
  title: string;
};

const LayerSwitch = ({ title }: LayerSwitchProps) => {
  return (
    <Switch.Root size="sm" colorPalette="blue">
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Label fontWeight="normal">{title}</Switch.Label>
    </Switch.Root>
  );
};

export { LayerSwitch };
