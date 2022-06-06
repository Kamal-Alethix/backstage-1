import { RouteRef, SubRouteRef, ExternalRouteRef } from '@backstage/core-plugin-api';
import { AppOptions } from './types';
export declare function resolveRouteBindings(bindRoutes: AppOptions['bindRoutes']): Map<ExternalRouteRef<any, any>, RouteRef<any> | SubRouteRef<any>>;
