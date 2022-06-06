/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { ApiRef } from '@backstage/core-plugin-api';

/**
 * Properties of {@link TechRadarComponent}
 */
interface TechRadarComponentProps {
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
declare function RadarComponent(props: TechRadarComponentProps): JSX.Element;

/**
 * Properties for {@link TechRadarPage}
 */
interface TechRadarPageProps extends TechRadarComponentProps {
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
declare function RadarPage(props: TechRadarPageProps): JSX.Element;

/**
 * Tech Radar plugin instance
 */
declare const techRadarPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * Main Tech Radar Page
 *
 * @remarks
 *
 * Uses {@link TechRadarPageProps} as props
 */
declare const TechRadarPage: typeof RadarPage;

/**
 * {@link @backstage/core-plugin-api#ApiRef} for the {@link TechRadarApi}
 */
declare const techRadarApiRef: ApiRef<TechRadarApi>;
/**
 * Tech Radar API responsible for loading data for the plugin
 *
 * @remarks
 *
 * This should be implemented by user, as {@link https://github.com/backstage/backstage/blob/master/plugins/tech-radar/src/sample.ts | default}
 * serves only some static data for example purposes
 */
interface TechRadarApi {
    /**
     * Loads the TechRadar response data to pass through to the TechRadar component.
     * Takes the id prop of the TechRadarComponent or TechRadarPage to distinguish between multiple radars if needed
     */
    load: (id: string | undefined) => Promise<TechRadarLoaderResponse>;
}
/**
 * Tech Radar Ring which indicates stage of {@link RadarEntry}
 */
interface RadarRing {
    /**
     * ID of the Ring
     */
    id: string;
    /**
     * Display name of the Ring
     */
    name: string;
    /**
     * Color used for entries in particular Ring
     *
     * @remarks
     *
     * Supports any value parseable by {@link https://www.npmjs.com/package/color-string | color-string}
     */
    color: string;
}
/**
 * Tech Radar Quadrant which represent area/topic of {@link RadarEntry}
 */
interface RadarQuadrant {
    /**
     * ID of the Quadrant
     */
    id: string;
    /**
     * Display name of the Quadrant
     */
    name: string;
}
/**
 * Single Entry in Tech Radar
 */
interface RadarEntry {
    /**
     * React key to use for this Entry
     */
    key: string;
    /**
     * ID of this Radar Entry
     */
    id: string;
    /**
     * ID of {@link RadarQuadrant} this Entry belongs to
     */
    quadrant: string;
    /**
     * Display name of the Entry
     */
    title: string;
    /**
     * User-clickable URL when rendered in Radar
     *
     * @remarks
     *
     * You can use `#` if you don't want to provide any other url
     */
    url: string;
    /**
     * History of the Entry moving through {@link RadarRing}
     */
    timeline: Array<RadarEntrySnapshot>;
    /**
     * Description of the Entry
     */
    description?: string;
}
/**
 * State of {@link RadarEntry} at given point in time
 */
interface RadarEntrySnapshot {
    /**
     * Point in time when change happened
     */
    date: Date;
    /**
     * ID of {@link RadarRing}
     */
    ringId: string;
    /**
     * Description of change
     */
    description?: string;
    /**
     * Indicates trend compared to previous snapshot
     */
    moved?: MovedState;
}
/**
 * Indicates how {@link RadarEntry} moved though {@link RadarRing} on {@link RadarEntry.timeline}
 */
declare enum MovedState {
    /**
     * Moved down
     */
    Down = -1,
    /**
     * Didn't move
     */
    NoChange = 0,
    /**
     * Move up
     */
    Up = 1
}
/**
 * Response from {@link TechRadarApi}
 */
interface TechRadarLoaderResponse {
    /**
     * Quadrant of Tech Radar. Should be 4
     */
    quadrants: RadarQuadrant[];
    /**
     * Rings of Tech Radar
     */
    rings: RadarRing[];
    /**
     * Entries visualised in Tech Radar
     */
    entries: RadarEntry[];
}

/**
 * A Backstage plugin that lets you display a Tech Radar for your organization
 *
 * @packageDocumentation
 */

/**
 * @deprecated Use plugin extensions instead
 */
declare const Router: typeof RadarPage;

export { MovedState, RadarEntry, RadarEntrySnapshot, RadarPage, RadarQuadrant, RadarRing, Router, TechRadarApi, RadarComponent as TechRadarComponent, TechRadarComponentProps, TechRadarLoaderResponse, TechRadarPage, TechRadarPageProps, techRadarPlugin as plugin, techRadarApiRef, techRadarPlugin };
