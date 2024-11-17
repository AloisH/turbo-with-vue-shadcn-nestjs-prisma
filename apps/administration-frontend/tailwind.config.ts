import sharedConfig from "@heloir/config-tailwind/config";
import { type Config } from "tailwindcss";

const config: Pick<Config, "presets" | "content"> = {
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  presets: [sharedConfig],
};

export default config;
