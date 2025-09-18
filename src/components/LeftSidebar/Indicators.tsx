import { Accordion, IconButton, Span } from "@chakra-ui/react";
import { LayerSwitch } from "./LayerSwitch";
import { Tooltip } from "../ui";
import { HiOutlineInformationCircle } from "react-icons/hi";

interface SectionItem {
  name: string;
  datasetId: string;
  type: string;
}

interface SubSection {
  title: string;
  description: string;
  datasets: SectionItem[];
}

interface Section {
  title: string;
  items: SubSection[];
}

type IndicatorsProps = {
  sections: Section[];
};

const Indicators = ({ sections }: IndicatorsProps) => {
  return (
    <Accordion.Root multiple defaultValue={["0"]} px={4}>
      {sections.map((section, i) => (
        <Accordion.Item key={section.title} value={`${i}`}>
          <Accordion.ItemTrigger>
            <Span flex="1" as="h3" fontWeight={600} fontSize="1rem">
              {section.title}
            </Span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <Accordion.Root multiple>
                {section.items.map((item, n) => (
                  <Accordion.Item key={item.title} value={`${n}`}>
                    <Accordion.ItemTrigger>
                      <Span flex="1">
                        {item.title}
                        <Tooltip content={item.description} interactive>
                          <IconButton
                            aria-label="Dataset Information"
                            variant="ghost"
                            color="gray.emphasized"
                          >
                            <HiOutlineInformationCircle />
                          </IconButton>
                        </Tooltip>
                      </Span>
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody>
                        {item.datasets.map((dataset) => (
                          <LayerSwitch
                            key={dataset.datasetId}
                            title={dataset.name}
                          />
                        ))}
                      </Accordion.ItemBody>
                    </Accordion.ItemContent>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export { Indicators };
