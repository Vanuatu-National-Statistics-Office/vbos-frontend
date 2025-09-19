import { Accordion, Heading, IconButton, Span } from "@chakra-ui/react";
import { LayerSwitch } from "./LayerSwitch";
import { Tooltip } from "../ui";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { LuMinus, LuPlus } from "react-icons/lu";

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
    <Accordion.Root multiple defaultValue={["0"]}>
      {sections.map((section, i) => (
        <Accordion.Item key={section.title} value={`${i}`}>
          <Accordion.ItemTrigger cursor="pointer" px={4}>
            <Heading
              flex="1"
              as="h3"
              fontWeight={600}
              fontSize="1rem"
              m={0}
              color="blue.800"
            >
              {section.title}
            </Heading>
            <Accordion.ItemIndicator asChild color="fg">
              <Accordion.ItemContext>
                {(context) => (context.expanded ? <LuMinus /> : <LuPlus />)}
              </Accordion.ItemContext>
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody p={0}>
              <Accordion.Root multiple>
                {section.items.map((item, n) => (
                  <Accordion.Item key={item.title} value={`${n}`}>
                    <Accordion.ItemTrigger cursor="pointer" px={4} py={1}>
                      <Span
                        flex="1"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        fontWeight="normal"
                        fontSize="sm"
                      >
                        {item.title}
                        <Tooltip content={item.description} interactive>
                          <IconButton
                            as="span"
                            size="xs"
                            aria-label="Dataset Information"
                            variant="plain"
                            color="gray.emphasized"
                            textAlign="right"
                            onClick={(e) => e.preventDefault()}
                            ml="auto"
                          >
                            <HiOutlineInformationCircle />
                          </IconButton>
                        </Tooltip>
                      </Span>
                      <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                      <Accordion.ItemBody px={4} pt={0}>
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
