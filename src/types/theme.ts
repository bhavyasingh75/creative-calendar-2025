export type ThemeColor = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
};

export const themes: ThemeColor[] = [
  {
    name: "Orange Sunset",
    primary: "#f97316",
    secondary: "#fed7aa",
    accent: "#ea580c",
    background: "#fff7ed",
  },
  {
    name: "Ocean Blue",
    primary: "#0ea5e9",
    secondary: "#bae6fd",
    accent: "#0284c7",
    background: "#f0f9ff",
  },
  {
    name: "Forest Green",
    primary: "#22c55e",
    secondary: "#bbf7d0",
    accent: "#16a34a",
    background: "#f0fdf4",
  },
  {
    name: "Purple Dream",
    primary: "#a855f7",
    secondary: "#e9d5ff",
    accent: "#9333ea",
    background: "#faf5ff",
  },
];
