import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'naturgy-orange': '#e57200',
        'naturgy-blue': '#004571',
        'naturgy-light-blue': '#7FBBE3',
        'naturgy-gray': '#333333',
      },
    },
  },
  plugins: [],
};
export default config;
