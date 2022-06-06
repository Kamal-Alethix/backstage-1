/// <reference types="react" />
import { RouteRef, SubRouteRef, ExternalRouteRef, BackstagePlugin } from '@backstage/core-plugin-api';
declare type RouteRefType = Exclude<keyof RouteRef, 'params' | 'path' | 'title' | 'icon'>;
export declare const routeRefType: RouteRefType;
export declare type AnyParams = {
    [param in string]: string;
} | undefined;
export declare type AnyRouteRef = RouteRef<any> | SubRouteRef<any> | ExternalRouteRef<any, any>;
export declare type RouteFunc<Params extends AnyParams> = (...[params]: Params extends undefined ? readonly [] : readonly [Params]) => string;
export interface BackstageRouteObject {
    caseSensitive: boolean;
    children?: BackstageRouteObject[];
    element: React.ReactNode;
    path: string;
    routeRefs: Set<RouteRef>;
    plugin?: BackstagePlugin;
}
export declare function isRouteRef<Params extends AnyParams>(routeRef: RouteRef<Params> | SubRouteRef<Params> | ExternalRouteRef<Params, any>): routeRef is RouteRef<Params>;
export declare function isSubRouteRef<Params extends AnyParams>(routeRef: RouteRef<Params> | SubRouteRef<Params> | ExternalRouteRef<Params, any>): routeRef is SubRouteRef<Params>;
export declare function isExternalRouteRef<Params extends AnyParams, Optional extends boolean>(routeRef: RouteRef<Params> | SubRouteRef<Params> | ExternalRouteRef<Params, Optional>): routeRef is ExternalRouteRef<Params, Optional>;
export {};
