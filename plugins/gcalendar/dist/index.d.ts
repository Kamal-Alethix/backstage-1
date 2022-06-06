/// <reference types="react" />
/// <reference types="@maxim_mazurok/gapi.client.calendar" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { OAuthApi, FetchApi } from '@backstage/core-plugin-api';

declare const gcalendarPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const HomePageCalendar: () => JSX.Element;

declare type GCalendarList = gapi.client.calendar.CalendarList;
declare type GCalendar = gapi.client.calendar.CalendarListEntry;
declare type EventAttendee = gapi.client.calendar.EventAttendee;
declare type GCalendarEvent = gapi.client.calendar.Event & Pick<GCalendar, 'backgroundColor' | 'primary'> & Pick<EventAttendee, 'responseStatus'> & {
    calendarId?: string;
};
declare enum ResponseStatus {
    needsAction = "needsAction",
    accepted = "accepted",
    declined = "declined",
    maybe = "tentative"
}

declare type Options = {
    authApi: OAuthApi;
    fetchApi: FetchApi;
};
declare const gcalendarApiRef: _backstage_core_plugin_api.ApiRef<GCalendarApiClient>;
declare class GCalendarApiClient {
    private readonly authApi;
    private readonly fetchApi;
    constructor(options: Options);
    private get;
    getCalendars(params?: any): Promise<gapi.client.calendar.CalendarList>;
    getEvents(calendarId: string, params?: any): Promise<{
        items: GCalendarEvent[];
    }>;
}

export { EventAttendee, GCalendar, GCalendarApiClient, GCalendarEvent, GCalendarList, HomePageCalendar, ResponseStatus, gcalendarApiRef, gcalendarPlugin };
