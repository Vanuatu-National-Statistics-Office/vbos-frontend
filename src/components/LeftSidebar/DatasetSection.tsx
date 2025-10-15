import { Accordion, IconButton, Span } from "@chakra-ui/react";
import { Tooltip } from "../ui";
import { LayerSwitch } from "./LayerSwitch";
import { Dataset } from "@/types/api";
import { LuInfo } from "react-icons/lu";

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
      <Accordion.ItemTrigger cursor="pointer" px={4} py={1}>
        <Span
          flex="1"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontWeight="normal"
          fontSize="sm"
        >
          {DATASET_TYPES[title]}
          <Tooltip
            content={`Datasets categorized as ${DATASET_TYPES[title]}.`}
            interactive
          >
            <IconButton
              as="span"
              size="xs"
              aria-label="Dataset Information"
              variant="plain"
              color="gray.emphasized"
              textAlign="right"
              ml="auto"
            >
              <LuInfo />
            </IconButton>
          </Tooltip>
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody px={4} pt={0}>
          {datasets.map((dataset) => (
            <LayerSwitch key={dataset.id} title={dataset.name} />
          ))}
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
