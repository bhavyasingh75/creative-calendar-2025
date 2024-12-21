import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type {
  GoogleCalendarEvent,
  GoogleCalendarConfig,
} from "../types/googleCalendar";
import { loadGoogleApi, initializeGoogleAuth } from "../utils/googleApi";

export function useGoogleCalendar() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useLocalStorage<GoogleCalendarConfig>(
    "google-calendar-config",
    {
      enabled: false,
      syncEnabled: false,
    }
  );

  const fetchEvents = async (startDate: Date, endDate: Date) => {
    if (!config.enabled || !config.calendarId) return;

    setIsLoading(true);
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: config.calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      setEvents(response.result.items);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Initialize Google API client
      await loadGoogleApi();

      // Initialize token client
      const tokenClient = initializeGoogleAuth();

      // Request token
      return new Promise<void>((resolve, reject) => {
        tokenClient.callback = async (response) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          try {
            // Get calendar list
            const calendarList = await gapi.client.calendar.calendarList.list();
            const primaryCalendar = calendarList.result.items?.find(
              (cal) => cal.primary
            );

            if (!primaryCalendar) {
              throw new Error("No primary calendar found");
            }

            setConfig({
              enabled: true,
              calendarId: primaryCalendar.id,
              syncEnabled: true,
            });

            // Fetch initial events
            const now = new Date();
            await fetchEvents(
              new Date(now.getFullYear(), now.getMonth(), 1),
              new Date(now.getFullYear(), now.getMonth() + 1, 0)
            );
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        tokenClient.requestAccessToken({ prompt: "consent" });
      });
    } catch (error) {
      console.error("Failed to connect to Google Calendar:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to connect to Google Calendar"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectCalendar = () => {
    if (gapi.auth2?.getAuthInstance()) {
      gapi.auth2.getAuthInstance().signOut();
    }
    setConfig({
      enabled: false,
      syncEnabled: false,
      calendarId: undefined,
    });
    setEvents([]);
  };

  return {
    events,
    isLoading,
    error,
    config,
    connectCalendar,
    disconnectCalendar,
    fetchEvents,
    setConfig,
  };
}
