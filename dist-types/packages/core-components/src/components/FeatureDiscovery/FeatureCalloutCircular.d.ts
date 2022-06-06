import { PropsWithChildren } from 'react';
/** @public */
export declare type FeatureCalloutCircleClassKey = '@keyframes pulsateSlightly' | '@keyframes pulsateAndFade' | 'featureWrapper' | 'backdrop' | 'dot' | 'pulseCircle' | 'text';
export declare type Props = {
    featureId: string;
    title: string;
    description: string;
};
/**
 * One-time, round 'telescope' animation showing new feature.
 *
 * @public
 *
 */
export declare function FeatureCalloutCircular(props: PropsWithChildren<Props>): JSX.Element;
