import { DateTime } from 'luxon';
import { GCalendarEvent } from '../../api';
export declare function getZoomLink(event: GCalendarEvent): string;
export declare function getTimePeriod(event: GCalendarEvent): string;
export declare function isPassed(event: GCalendarEvent): boolean;
export declare function isAllDay(event: GCalendarEvent): boolean;
export declare function getStartDate(event: GCalendarEvent): DateTime;
