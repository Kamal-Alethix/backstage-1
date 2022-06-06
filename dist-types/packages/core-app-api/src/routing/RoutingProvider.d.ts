import { ReactNode } from 'react';
import { ExternalRouteRef, RouteRef, SubRouteRef } from '@backstage/core-plugin-api';
import { BackstageRouteObject } from './types';
declare type ProviderProps = {
    routePaths: Map<RouteRef, string>;
    routeParents: Map<RouteRef, RouteRef | undefined>;
    routeObjects: BackstageRouteObject[];
    routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
    basePath?: string;
    children: ReactNode;
};
export declare const RoutingProvider: ({ routePaths, routeParents, routeObjects, routeBindings, basePath, children, }: ProviderProps) => JSX.Element;
export {};
