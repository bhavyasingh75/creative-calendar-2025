declare const google: Window["google"];

declare var gapi: {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (config: {
      apiKey: string;
      clientId: string;
      discoveryDocs: string[];
      scope: string;
    }) => Promise<void>;
    calendar: {
      events: {
        list: (params: {
          calendarId: string;
          timeMin: string;
          timeMax: string;
          singleEvents: boolean;
          orderBy: string;
        }) => Promise<{
          result: {
            items: any[];
          };
        }>;
      };
      calendarList: {
        list: () => Promise<{
          result: {
            items?: Array<{
              id: string;
              primary?: boolean;
            }>;
          };
        }>;
      };
    };
  };
  auth2: {
    getAuthInstance: () => {
      isSignedIn: {
        get: () => boolean;
      };
      signIn: () => Promise<void>;
      signOut: () => Promise<void>;
    };
  };
};

interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient: (config: {
          client_id: string;
          scope: string;
          callback: (response: { error?: string }) => void;
        }) => {
          requestAccessToken: (options?: { prompt?: string }) => void;
          callback: (response: { error?: string }) => void;
        };
      };
    };
  };
}
