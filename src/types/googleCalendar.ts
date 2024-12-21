export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string;
  };
  end: {
    dateTime: string;
    date?: string;
  };
  description?: string;
}

export interface GoogleCalendarConfig {
  enabled: boolean;
  calendarId?: string;
  syncEnabled: boolean;
}