/**
 * Catalog Graph Plugin instance.
 * @public
 */
export declare const catalogGraphPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    catalogGraph: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {
    catalogEntity: import("@backstage/core-plugin-api").ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;
