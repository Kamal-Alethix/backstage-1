import { BackstagePlugin, ExternalRouteRef, RouteRef, SubRouteRef } from '@backstage/core-plugin-api';
import { AnyRouteRef } from './types';
export declare function validateRouteParameters(routePaths: Map<AnyRouteRef, string>, routeParents: Map<AnyRouteRef, AnyRouteRef | undefined>): void;
export declare function validateRouteBindings(routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>, plugins: Iterable<BackstagePlugin<{}, Record<string, ExternalRouteRef>>>): void;
