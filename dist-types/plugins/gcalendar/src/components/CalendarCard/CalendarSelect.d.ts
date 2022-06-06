/// <reference types="react" />
import { GCalendar } from '../../api';
declare type CalendarSelectProps = {
    disabled: boolean;
    selectedCalendars?: string[];
    setSelectedCalendars: (value: string[]) => void;
    calendars: GCalendar[];
};
export declare const CalendarSelect: ({ disabled, selectedCalendars, setSelectedCalendars, calendars, }: CalendarSelectProps) => JSX.Element;
export {};
