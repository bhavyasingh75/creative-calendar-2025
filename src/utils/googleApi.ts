export const loadGoogleApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof gapi === "undefined") {
      reject(new Error("Google API not loaded"));
      return;
    }

    gapi.load("client", async () => {
      try {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        });
        resolve();
      } catch (error) {
        console.error("Error initializing Google API client:", error);
        reject(error);
      }
    });
  });
};

export const initializeGoogleAuth = () => {
  return new google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    callback: () => {}, // We'll handle the callback in useGoogleCalendar
  });
};
