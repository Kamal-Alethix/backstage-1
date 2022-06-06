import { GCalendar, GCalendarEvent } from '../api';
declare type Options = {
    selectedCalendars?: string[];
    timeMin: string;
    timeMax: string;
    enabled: boolean;
    calendars: GCalendar[];
    timeZone: string;
    refreshTime?: number;
};
export declare const useEventsQuery: ({ selectedCalendars, calendars, enabled, timeMin, timeMax, timeZone, }: Options) => {
    events: GCalendarEvent[];
    isLoading: boolean;
};
export {};
