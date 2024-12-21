import React from "react";
import { Settings2 } from "lucide-react";
import { ThemeColor } from "../types/theme";

interface SettingsProps {
  onOpenSettings: () => void;
  currentTheme: ThemeColor;
}

export default function SettingsButton({
  onOpenSettings,
  currentTheme,
}: SettingsProps) {
  return (
    <button
      onClick={onOpenSettings}
      className="p-2 rounded-full hover:bg-opacity-10 transition-colors fixed bottom-4 right-4"
      style={{
        color: currentTheme.primary,
        backgroundColor: `${currentTheme.primary}10`,
      }}
      aria-label="Open Settings"
    >
      <Settings2 size={24} />
    </button>
  );
}
