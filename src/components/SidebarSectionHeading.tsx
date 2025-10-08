import React from "react";
import { Heading, HeadingProps } from "@chakra-ui/react";

const SidebarSectionHeading = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps
>((props, ref) => {
  return (
    <Heading
      ref={ref}
      flex="1"
      as="h3"
      fontWeight={600}
      fontSize="1rem"
      m={0}
      color="blue.800"
      {...props}
    />
  );
});

export { SidebarSectionHeading };
