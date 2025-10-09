// eslint-disable-next-line quotes
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: "https://vbos-backend.ds.io",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
