export declare const explorePlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    explore: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {
    catalogEntity: import("@backstage/core-plugin-api").ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;
