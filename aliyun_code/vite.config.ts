import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

import {
  WXZ_WEB_BUILDER_VITE_PLUGINS,
  WXZ_WEB_BUILDER_VITE_SERVER,
} from "wxz-web-builder-vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    ...WXZ_WEB_BUILDER_VITE_PLUGINS,
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    ...WXZ_WEB_BUILDER_VITE_SERVER,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  ssr: {
    noExternal: ["react-helmet-async", "react-router", "react-router-dom"],
  },
});
