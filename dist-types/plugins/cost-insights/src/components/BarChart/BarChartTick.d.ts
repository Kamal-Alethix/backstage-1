/// <reference types="react" />
declare type BarChartTickProps = {
    x: number;
    y: number;
    height: number;
    width: number;
    payload: {
        value: any;
    };
    visibleTicksCount: number;
    details?: JSX.Element;
};
export declare const BarChartTick: ({ x, y, height, width, payload, visibleTicksCount, details, }: BarChartTickProps) => JSX.Element;
export {};
