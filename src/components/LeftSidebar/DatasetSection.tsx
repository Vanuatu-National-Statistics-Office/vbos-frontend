import { Accordion } from "@chakra-ui/react";
import { LayerSwitch } from "./LayerSwitch";
import { Dataset } from "@/types/api";

type DatasetSectionProps = {
  title:
    | "baseline"
    | "estimated_damage"
    | "aid_resources_needed"
    | "estimate_financial_damage";
  datasets: Dataset[];
};

const DATASET_TYPES = {
  baseline: "Baseline",
  estimated_damage: "Estimated Hazard Damage",
  aid_resources_needed: "Immediate Response Resources",
  estimate_financial_damage: "Estimated Financial Damage",
};

export function DatasetSection({ title, datasets }: DatasetSectionProps) {
  return (
    <Accordion.Item key={title} value={title}>
      <Accordion.ItemTrigger
        cursor="pointer"
        px={4}
        py={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontWeight="normal"
        fontSize="sm"
      >
        {DATASET_TYPES[title]}
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody
          px={4}
          pt={0}
          display="flex"
          flexDirection="column"
          gap={1}
        >
          {datasets.map((dataset) => (
            <LayerSwitch
              key={dataset.id}
              dataType={dataset.dataType}
              id={dataset.id}
              title={dataset.name}
            />
          ))}
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
