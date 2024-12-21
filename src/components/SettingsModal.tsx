import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ThemeColor, themes } from "../types/theme";
import { GoogleCalendarConfig } from "../types/googleCalendar";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  googleCalendarConfig: GoogleCalendarConfig;
  onGoogleCalendarConnect: () => Promise<void>;
  onGoogleCalendarDisconnect: () => void;
  onGoogleCalendarConfigChange: (config: GoogleCalendarConfig) => void;
  error: string | null;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  googleCalendarConfig,
  onGoogleCalendarConnect,
  onGoogleCalendarDisconnect,
  onGoogleCalendarConfigChange,
  error,
}: SettingsModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-handwritten font-bold"
              style={{ color: currentTheme.primary }}
            >
              Calendar Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-handwritten font-semibold mb-3">
                Choose Theme
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => onThemeChange(theme)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTheme.name === theme.name
                        ? "shadow-lg"
                        : "border-transparent hover:border-opacity-50"
                    }`}
                    style={{
                      borderColor:
                        currentTheme.name === theme.name
                          ? currentTheme.primary
                          : "transparent",
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.secondary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                      </div>
                      <p className="text-sm font-handwritten font-semibold">
                        {theme.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* <div className="border-t pt-6">
              <h3 className="text-lg font-handwritten font-semibold mb-3">
                Google Calendar Integration
              </h3>
              <div className="space-y-4">
                {!googleCalendarConfig.enabled ? (
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsConnecting(true);
                      try {
                        await onGoogleCalendarConnect();
                      } catch (err) {
                        console.error("Failed to connect:", err);
                      } finally {
                        setIsConnecting(false);
                      }
                    }}
                    disabled={isConnecting}
                    className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <img
                          src="/google-calendar-icon.svg"
                          className="w-6 h-6"
                          alt=""
                        />
                        <span>Connect Google Calendar</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-600 rounded-full" />
                        Connected
                      </span>
                      <button
                        onClick={onGoogleCalendarDisconnect}
                        className="text-red-600 text-sm hover:text-red-700"
                      >
                        Disconnect
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="syncEnabled"
                        checked={googleCalendarConfig.syncEnabled}
                        onChange={(e) =>
                          onGoogleCalendarConfigChange({
                            ...googleCalendarConfig,
                            syncEnabled: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <label htmlFor="syncEnabled" className="text-sm">
                        Show Google Calendar events
                      </label>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-sm mt-2">{error}</div>
                )}
              </div>
            </div> */}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
