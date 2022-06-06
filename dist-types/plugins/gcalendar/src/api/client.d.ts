/// <reference types="@maxim_mazurok/gapi.client.calendar" />
import { OAuthApi, FetchApi } from '@backstage/core-plugin-api';
import { GCalendarEvent } from './types';
declare type Options = {
    authApi: OAuthApi;
    fetchApi: FetchApi;
};
export declare const gcalendarApiRef: import("@backstage/core-plugin-api").ApiRef<GCalendarApiClient>;
export declare class GCalendarApiClient {
    private readonly authApi;
    private readonly fetchApi;
    constructor(options: Options);
    private get;
    getCalendars(params?: any): Promise<gapi.client.calendar.CalendarList>;
    getEvents(calendarId: string, params?: any): Promise<{
        items: GCalendarEvent[];
    }>;
}
export {};
