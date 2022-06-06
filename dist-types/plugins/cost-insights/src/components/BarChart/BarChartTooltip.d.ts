import { ReactNode, PropsWithChildren } from 'react';
export declare type BarChartTooltipProps = {
    title: string;
    content?: ReactNode | string;
    subtitle?: ReactNode;
    topRight?: ReactNode;
    actions?: ReactNode;
};
export declare const BarChartTooltip: ({ title, content, subtitle, topRight, actions, children, }: PropsWithChildren<BarChartTooltipProps>) => JSX.Element;
