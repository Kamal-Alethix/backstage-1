/// <reference types="@maxim_mazurok/gapi.client.calendar" />
declare type Options = {
    enabled: boolean;
    refreshTime?: number;
};
export declare const useCalendarsQuery: ({ enabled }: Options) => import("react-query").UseQueryResult<gapi.client.calendar.CalendarListEntry[], unknown>;
export {};
