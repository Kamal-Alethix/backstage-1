/// <reference types="react" />
import { DomainEntity } from '@backstage/catalog-model';
import { TabProps } from '@material-ui/core';
import React from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

declare type DomainCardProps = {
    entity: DomainEntity;
};
declare const DomainCard: ({ entity }: DomainCardProps) => JSX.Element;

declare type SubRoute = {
    path: string;
    title: string;
    children: JSX.Element;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
declare type ExploreLayoutProps = {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
};
/**
 * Explore is a compound component, which allows you to define a custom layout
 *
 * @example
 * ```jsx
 * <ExploreLayout title="Explore ACME's ecosystem">
 *   <ExploreLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </ExploreLayout.Route>
 * </ExploreLayout>
 * ```
 */
declare const ExploreLayout: {
    ({ title, subtitle, children, }: ExploreLayoutProps): JSX.Element;
    Route: (props: SubRoute) => null;
};

declare const ExplorePage: () => JSX.Element;
declare const DomainExplorerContent: ({ title, }: {
    title?: string | undefined;
}) => JSX.Element;
declare const GroupsExplorerContent: ({ title, }: {
    title?: string | undefined;
}) => JSX.Element;
declare const ToolExplorerContent: ({ title }: {
    title?: string | undefined;
}) => JSX.Element;

declare const explorePlugin: _backstage_core_plugin_api.BackstagePlugin<{
    explore: _backstage_core_plugin_api.RouteRef<undefined>;
}, {
    catalogEntity: _backstage_core_plugin_api.ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;

declare const exploreRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;
/**
 * @deprecated This route is no longer used and can be removed
 */
declare const catalogEntityRouteRef: _backstage_core_plugin_api.ExternalRouteRef<{
    name: string;
    kind: string;
    namespace: string;
}, true>;

export { DomainCard, DomainExplorerContent, ExploreLayout, ExplorePage, GroupsExplorerContent, ToolExplorerContent, catalogEntityRouteRef, explorePlugin, exploreRouteRef, explorePlugin as plugin };
