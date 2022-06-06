/// <reference types="react" />
import { ContentRenderer, TooltipProps as RechartsTooltipProps, RechartsFunction } from 'recharts';
import { BarChartData, ResourceData } from '../../types';
export declare const defaultTooltip: ContentRenderer<RechartsTooltipProps>;
export declare type BarChartProps = {
    resources: ResourceData[];
    responsive?: boolean;
    displayAmount?: number;
    options?: Partial<BarChartData>;
    tooltip?: ContentRenderer<RechartsTooltipProps>;
    onClick?: RechartsFunction;
    onMouseMove?: RechartsFunction;
};
export declare const BarChart: ({ resources, responsive, displayAmount, options, tooltip, onClick, onMouseMove, }: BarChartProps) => JSX.Element;
