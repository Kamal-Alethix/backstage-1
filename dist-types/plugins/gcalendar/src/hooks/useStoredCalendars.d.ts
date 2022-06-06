export declare enum LocalStorageKeys {
    selectedCalendars = "google_calendars_selected"
}
export declare function useStoredCalendars(defaultValue: string[]): [string[], (value: string[]) => void];
