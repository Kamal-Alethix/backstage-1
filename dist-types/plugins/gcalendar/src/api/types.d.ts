/// <reference types="@maxim_mazurok/gapi.client.calendar" />
export declare type GCalendarList = gapi.client.calendar.CalendarList;
export declare type GCalendar = gapi.client.calendar.CalendarListEntry;
export declare type EventAttendee = gapi.client.calendar.EventAttendee;
export declare type GCalendarEvent = gapi.client.calendar.Event & Pick<GCalendar, 'backgroundColor' | 'primary'> & Pick<EventAttendee, 'responseStatus'> & {
    calendarId?: string;
};
export declare enum ResponseStatus {
    needsAction = "needsAction",
    accepted = "accepted",
    declined = "declined",
    maybe = "tentative"
}
