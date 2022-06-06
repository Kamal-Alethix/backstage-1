/// <reference types="react" />
export declare type ClockConfig = {
    label: string;
    timeZone: string;
};
/** @public */
export declare const HeaderWorldClock: (props: {
    clockConfigs: ClockConfig[];
}) => JSX.Element | null;
