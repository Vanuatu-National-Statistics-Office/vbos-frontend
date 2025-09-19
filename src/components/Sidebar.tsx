import { Box, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export const Sidebar = ({ title, children }: Props) => {
  return (
    <Box>
      <Box px={4} py={2} bg="blue.50">
        <Heading
          fontSize="xs"
          fontWeight="bold"
          textTransform="uppercase"
          color="blue.800"
          letterSpacing="wider"
        >
          {title}
        </Heading>
      </Box>
      {children}
    </Box>
  );
};
