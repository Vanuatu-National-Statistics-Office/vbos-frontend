import { Sidebar } from "../Sidebar";
import { Accordion, Box } from "@chakra-ui/react";
import { AreaSelect } from "./AreaSelect";
import { SidebarSectionHeading } from "../SidebarSectionHeading";

const RightSidebar = () => {
  return (
    <Sidebar direction="right" title="Analysis">
      <Box px={4}>
        <AreaSelect />
      </Box>
      <Box>
        <Accordion.Root multiple defaultValue={["0"]}>
          <Accordion.Item value="0">
            <Accordion.ItemTrigger cursor="pointer" px={4}>
              <SidebarSectionHeading>Overview</SidebarSectionHeading>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody py={0} px={4}>
                Soon...
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
          <Accordion.Item value="1">
            <Accordion.ItemTrigger cursor="pointer" px={4}>
              <SidebarSectionHeading>Selected Indicators</SidebarSectionHeading>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody py={0} px={4}>
                Soon...
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>
    </Sidebar>
  );
};

export { RightSidebar };
