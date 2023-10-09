import { type Config } from "tailwindcss";
import path from "path";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    path.join(path.dirname(require.resolve("netrondata")), "**/*.{js,cjs,mjs}"),
  ],
  theme: {
    extend: {},
  },

  plugins: [],
} satisfies Config;
