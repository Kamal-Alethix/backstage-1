/// <reference types="react" />
import { TechRadarComponentProps } from './RadarComponent';
/**
 * Properties for {@link TechRadarPage}
 */
export interface TechRadarPageProps extends TechRadarComponentProps {
    /**
     * Title
     */
    title?: string;
    /**
     * Subtitle
     */
    subtitle?: string;
    /**
     * Page Title
     */
    pageTitle?: string;
}
/**
 * Main Page of Tech Radar
 */
export declare function RadarPage(props: TechRadarPageProps): JSX.Element;
