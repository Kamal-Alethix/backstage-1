import { matchRoutes } from 'react-router-dom';
import { BackstageRouteObject, AnyParams, RouteFunc } from './types';
import { RouteRef, ExternalRouteRef, SubRouteRef } from '@backstage/core-plugin-api';
export declare class RouteResolver {
    private readonly routePaths;
    private readonly routeParents;
    private readonly routeObjects;
    private readonly routeBindings;
    private readonly appBasePath;
    constructor(routePaths: Map<RouteRef, string>, routeParents: Map<RouteRef, RouteRef | undefined>, routeObjects: BackstageRouteObject[], routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>, appBasePath: string);
    resolve<Params extends AnyParams>(anyRouteRef: RouteRef<Params> | SubRouteRef<Params> | ExternalRouteRef<Params, any>, sourceLocation: Parameters<typeof matchRoutes>[1]): RouteFunc<Params> | undefined;
    private trimPath;
}
