import { PropsWithChildren } from 'react';
export declare type BarChartLegendOptions = {
    previousName: string;
    previousFill: string;
    currentName: string;
    currentFill: string;
    hideMarker?: boolean;
};
export declare type BarChartLegendProps = {
    costStart: number;
    costEnd: number;
    options?: Partial<BarChartLegendOptions>;
};
export declare const BarChartLegend: ({ costStart, costEnd, options, children, }: PropsWithChildren<BarChartLegendProps>) => JSX.Element;
