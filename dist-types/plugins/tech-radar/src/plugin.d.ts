/**
 * Tech Radar plugin instance
 */
export declare const techRadarPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * Main Tech Radar Page
 *
 * @remarks
 *
 * Uses {@link TechRadarPageProps} as props
 */
export declare const TechRadarPage: typeof import("./components/RadarPage").RadarPage;
