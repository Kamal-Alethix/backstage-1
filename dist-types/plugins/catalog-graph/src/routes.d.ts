/**
 * Route pointing to the standalone catalog graph page.
 *
 * @public
 */
export declare const catalogGraphRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
/**
 * Route pointing to the entity page.
 * Used to navigate from the graph to an entity.
 *
 * @public
 * @deprecated This route is no longer used and can be removed
 */
export declare const catalogEntityRouteRef: import("@backstage/core-plugin-api").ExternalRouteRef<{
    name: string;
    kind: string;
    namespace: string;
}, true>;
