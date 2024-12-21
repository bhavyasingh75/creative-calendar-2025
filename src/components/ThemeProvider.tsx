import React, { useEffect } from "react";
import type { ThemeColor } from "../types/theme";

interface ThemeProviderProps {
  theme: ThemeColor;
  children: React.ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--color-background", theme.background);
  }, [theme]);

  return <>{children}</>;
}
