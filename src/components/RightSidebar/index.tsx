import { Sidebar } from "../Sidebar";
import { Box } from "@chakra-ui/react";
import { AreaSelect } from "./AreaSelect";

const RightSidebar = () => {
  return (
    <Sidebar title="Analysis">
      <Box px={4}>
        <AreaSelect />
      </Box>
    </Sidebar>
  );
};

export { RightSidebar };
