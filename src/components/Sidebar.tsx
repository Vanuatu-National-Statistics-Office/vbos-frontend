import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Sidebar = ({ children }: Props) => {
  return <Box>{children}</Box>;
};
