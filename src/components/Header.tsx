import { Box, Heading } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Box
      as="header"
      display="flex"
      alignItems="center"
      gap="5"
      bg="white"
      px="4"
      py="3"
      shadow="base"
    >
      <Heading
        font="Work Sans"
        letterSpacing="0.125rem"
        fontWeight="400"
        textTransform="uppercase"
        size="md"
        as="h1"
        flex="1"
      >
        VBoS MIS
      </Heading>
    </Box>
  );
};
