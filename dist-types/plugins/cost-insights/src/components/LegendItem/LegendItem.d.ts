import { PropsWithChildren } from 'react';
export declare type LegendItemProps = {
    title: string;
    tooltipText?: string;
    markerColor?: string;
};
export declare const LegendItem: ({ title, tooltipText, markerColor, children, }: PropsWithChildren<LegendItemProps>) => JSX.Element;
