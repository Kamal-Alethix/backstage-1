import { RouteRef, AnyParams, SubRouteRef } from './types';
/**
 * React hook for retrieving dynamic params from the current URL.
 * @param _routeRef - Ref of the current route.
 * @public
 */
export declare function useRouteRefParams<Params extends AnyParams>(_routeRef: RouteRef<Params> | SubRouteRef<Params>): Params;
