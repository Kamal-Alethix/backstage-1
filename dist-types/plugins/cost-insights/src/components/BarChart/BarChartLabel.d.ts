import { PropsWithChildren } from 'react';
declare type BarChartLabelProps = {
    x: number;
    y: number;
    height: number;
    width: number;
    details?: JSX.Element;
};
export declare const BarChartLabel: ({ x, y, height, width, details, children, }: PropsWithChildren<BarChartLabelProps>) => JSX.Element;
export {};
