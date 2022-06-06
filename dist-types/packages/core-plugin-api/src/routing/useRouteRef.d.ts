import { AnyParams, ExternalRouteRef, RouteFunc, RouteRef, SubRouteRef } from './types';
/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export declare function useRouteRef<Optional extends boolean, Params extends AnyParams>(routeRef: ExternalRouteRef<Params, Optional>): Optional extends true ? RouteFunc<Params> | undefined : RouteFunc<Params>;
/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export declare function useRouteRef<Params extends AnyParams>(routeRef: RouteRef<Params> | SubRouteRef<Params>): RouteFunc<Params>;
