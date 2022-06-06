/// <reference types="react" />
import { GaugePropsGetColor } from './Gauge';
declare type Props = {
    /**
     * Progress value between 0.0 - 1.0.
     */
    value: number;
    getColor?: GaugePropsGetColor;
};
export declare function LinearGauge(props: Props): JSX.Element | null;
export {};
