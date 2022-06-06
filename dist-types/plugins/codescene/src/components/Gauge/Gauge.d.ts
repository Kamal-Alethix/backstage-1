/// <reference types="react" />
import { BackstagePalette } from '@backstage/theme';
export declare type GaugeProps = {
    value: number;
    max: number;
    tooltipDelay?: number;
    tooltipText: string;
};
export declare type GaugePropsGetColorOptions = {
    palette: BackstagePalette;
    value: number;
    max: number;
};
export declare type GaugePropsGetColor = (args: GaugePropsGetColorOptions) => string;
export declare const getProgressColor: GaugePropsGetColor;
/**
 * Circular Progress Bar
 *
 */
export declare function Gauge(props: GaugeProps): JSX.Element;
