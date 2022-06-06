/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

declare const newRelicDashboardPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const EntityNewRelicDashboardContent: () => JSX.Element;
declare const EntityNewRelicDashboardCard: () => JSX.Element;
/**
 * Render dashboard snapshots from Newrelic in backstage. Use dashboards which have the tag `isDashboardPage: true`
 *
 * @remarks
 * This can be helpful for rendering dashboards outside of Entity Catalog.
 *
 * @public
 */
declare const DashboardSnapshotComponent: ({ guid, name, permalink, duration, }: {
    guid: string;
    name: string;
    permalink: string;
    duration: number;
}) => JSX.Element;

declare const isNewRelicDashboardAvailable: (entity: Entity) => boolean;

export { DashboardSnapshotComponent, EntityNewRelicDashboardCard, EntityNewRelicDashboardContent, isNewRelicDashboardAvailable, newRelicDashboardPlugin };
