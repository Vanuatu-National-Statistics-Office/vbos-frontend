import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

export const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: { value: "Work Sans" },
        heading: { value: "Work Sans" },
      },
      colors: {
        blue: {
          50: { value: "#EFF6FF" },
          solid: { value: "#2563EB" },
        },
        gray: {
          emphasized: { value: "#D4D4D8" },
        },
      },
    },
  },
});

export default createSystem(defaultConfig, config);
