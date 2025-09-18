import { Box, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

export const Sidebar = ({ title, children }: Props) => {
  return (
    <Box>
      <Heading fontSize="0.8rem" textTransform="uppercase" bg="blue.50" px={4}>
        {title}
      </Heading>
      {children}
    </Box>
  );
};
