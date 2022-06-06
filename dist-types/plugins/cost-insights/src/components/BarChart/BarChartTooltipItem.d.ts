/// <reference types="react" />
export declare type TooltipItem = {
    fill: string;
    label: string;
    value: string;
};
export declare type BarChartTooltipItemProps = {
    item: TooltipItem;
};
export declare const BarChartTooltipItem: ({ item }: BarChartTooltipItemProps) => JSX.Element;
