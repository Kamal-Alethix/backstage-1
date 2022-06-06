import { Entity } from '@backstage/catalog-model';
/**
 * A stable route ref that points to the catalog page for an individual entity.
 *
 * This `RouteRef` can be imported and used directly, and does not need to be referenced
 * via an `ExternalRouteRef`.
 *
 * If you want to replace the `EntityPage` from `@backstage/catalog-plugin` in your app,
 * you need to use the `entityRouteRef` as the mount point instead of your own.
 * @public
 */
export declare const entityRouteRef: import("@backstage/core-plugin-api").RouteRef<{
    name: string;
    kind: string;
    namespace: string;
}>;
/**
 * Utility function to get suitable route params for entityRoute, given an
 * @public
 */
export declare function entityRouteParams(entity: Entity): {
    readonly kind: string;
    readonly namespace: string;
    readonly name: string;
};
