/// <reference types="react" />
/**
 * Picks {num} elements from {arr} evenly, from the first to the last
 */
export declare function pickElements<T>(arr: ReadonlyArray<T>, num: number): Array<T>;
export declare function labelFormatter(epoch: number): JSX.Element;
export declare function labelFormatterWithoutTime(epoch: number): JSX.Element;
export declare function tickFormatterX(epoch: number): string;
export declare function tickFormatterY(duration: number): string;
export declare function tooltipValueFormatter(durationOrCount: number, name: string): (JSX.Element | null)[];
export declare function formatDuration(millis: number): string;
export declare function formatDurationFromSeconds(seconds: number): string;
