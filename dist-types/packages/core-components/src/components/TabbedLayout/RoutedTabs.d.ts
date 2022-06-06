/// <reference types="react" />
import { SubRoute } from './types';
export declare function useSelectedSubRoute(subRoutes: SubRoute[]): {
    index: number;
    route: SubRoute;
    element: JSX.Element;
};
export declare function RoutedTabs(props: {
    routes: SubRoute[];
}): JSX.Element;
