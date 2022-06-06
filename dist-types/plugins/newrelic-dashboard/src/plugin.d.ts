/// <reference types="react" />
export declare const newRelicDashboardPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const EntityNewRelicDashboardContent: () => JSX.Element;
export declare const EntityNewRelicDashboardCard: () => JSX.Element;
/**
 * Render dashboard snapshots from Newrelic in backstage. Use dashboards which have the tag `isDashboardPage: true`
 *
 * @remarks
 * This can be helpful for rendering dashboards outside of Entity Catalog.
 *
 * @public
 */
export declare const DashboardSnapshotComponent: ({ guid, name, permalink, duration, }: {
    guid: string;
    name: string;
    permalink: string;
    duration: number;
}) => JSX.Element;
