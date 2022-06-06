/// <reference types="react" />
import { BackstageRouteObject } from './types';
/**
 * Logs a "navigate" event with appropriate plugin-level analytics context
 * attributes each time the user navigates to a page.
 */
export declare const RouteTracker: ({ routeObjects, }: {
    routeObjects: BackstageRouteObject[];
}) => JSX.Element;
