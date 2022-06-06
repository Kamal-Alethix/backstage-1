import { BackstagePalette } from '@backstage/theme';
import { ReactNode } from 'react';
/** @public */
export declare type GaugeClassKey = 'root' | 'overlay' | 'description' | 'circle' | 'colorUnknown';
/** @public */
export declare type GaugeProps = {
    value: number;
    fractional?: boolean;
    inverse?: boolean;
    unit?: string;
    max?: number;
    description?: ReactNode;
    getColor?: GaugePropsGetColor;
};
/** @public */
export declare type GaugePropsGetColorOptions = {
    palette: BackstagePalette;
    value: number;
    inverse?: boolean;
    max?: number;
};
/** @public */
export declare type GaugePropsGetColor = (args: GaugePropsGetColorOptions) => string;
export declare const getProgressColor: GaugePropsGetColor;
/**
 * Circular Progress Bar
 *
 * @public
 *
 */
export declare function Gauge(props: GaugeProps): JSX.Element;
