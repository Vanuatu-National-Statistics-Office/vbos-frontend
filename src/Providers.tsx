import "@fontsource/work-sans/index.css";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "./Theme";

function Providers({ children }: React.PropsWithChildren) {
  return <ChakraProvider value={theme}>{children}</ChakraProvider>;
}

export default Providers;
