/// <reference types="react" />
/**
 * Properties of {@link TechRadarComponent}
 */
export interface TechRadarComponentProps {
    /**
     * ID of this Tech Radar
     *
     * @remarks
     *
     * Used when there are multiple Tech Radars and passed to {@link TechRadarApi.load}
     */
    id?: string;
    /**
     * Width of Tech Radar
     */
    width: number;
    /**
     * Height of Tech Radar
     */
    height: number;
    /**
     * Custom React props to the `<svg>` element created for Tech Radar
     */
    svgProps?: object;
    /**
     * Text to filter {@link RadarEntry} inside Tech Radar
     */
    searchText?: string;
}
/**
 * Main React component of Tech Radar
 *
 * @remarks
 *
 * For advanced use cases. Typically, you want to use {@link TechRadarPage}
 */
export declare function RadarComponent(props: TechRadarComponentProps): JSX.Element;
