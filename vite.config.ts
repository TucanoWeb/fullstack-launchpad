import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    define: {
      "process.env.AI_KEY": JSON.stringify(env.AI_KEY),
      "process.env.AI_ENDPOINT": JSON.stringify(env.AI_ENDPOINT),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  };
});
