import { Sidebar } from "../Sidebar";
import { Accordion, Box, Button } from "@chakra-ui/react";
import { AreaSelect } from "./AreaSelect";
import { SidebarSectionHeading } from "../SidebarSectionHeading";
import { LuDownload } from "react-icons/lu";
import { DateSelect } from "./DateSelect";
import { Stats } from "./Stats";

const RightSidebar = () => {
  return (
    <Sidebar direction="right" title="Analysis">
      <Box
        px={6}
        py={2}
        borderBottom="1px solid"
        borderColor="border.emphasized"
      >
        <AreaSelect />
      </Box>
      <Box flex="1" overflow="scroll">
        <Accordion.Root multiple defaultValue={["0"]}>
          <Accordion.Item value="0">
            <Accordion.ItemTrigger cursor="pointer" px={6}>
              <SidebarSectionHeading>Selected Indicators</SidebarSectionHeading>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody px={6}>
                <DateSelect />
                <Stats />
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Box>
      <Box
        borderTop="1px solid"
        borderColor="border.emphasized"
        px={6}
        py={2}
        mt="auto"
        position="sticky"
        bottom="0"
        bg="bg"
      >
        <Button w="full" colorPalette="blue" variant="outline">
          <LuDownload />
          Download Data
        </Button>
      </Box>
    </Sidebar>
  );
};

export { RightSidebar };
