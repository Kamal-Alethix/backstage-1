import { ReactNode } from 'react';
import { BottomLinkProps } from '../../layout/BottomLink';
import { InfoCardVariants } from '../../layout/InfoCard';
import { GaugePropsGetColor } from './Gauge';
declare type Props = {
    title: string;
    subheader?: string;
    variant?: InfoCardVariants;
    /** Progress in % specified as decimal, e.g. "0.23" */
    progress: number;
    description?: ReactNode;
    icon?: ReactNode;
    inverse?: boolean;
    deepLink?: BottomLinkProps;
    getColor?: GaugePropsGetColor;
};
/** @public */
export declare type GaugeCardClassKey = 'root';
/**
 * {@link Gauge} with header, subheader and footer
 *
 * @public
 *
 */
export declare function GaugeCard(props: Props): JSX.Element;
export {};
