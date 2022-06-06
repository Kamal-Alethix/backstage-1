import { TabProps } from '@material-ui/core';
import { default as React } from 'react';
declare type SubRoute = {
    path: string;
    title: string;
    children: JSX.Element;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
declare type ExploreLayoutProps = {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
};
/**
 * Explore is a compound component, which allows you to define a custom layout
 *
 * @example
 * ```jsx
 * <ExploreLayout title="Explore ACME's ecosystem">
 *   <ExploreLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </ExploreLayout.Route>
 * </ExploreLayout>
 * ```
 */
export declare const ExploreLayout: {
    ({ title, subtitle, children, }: ExploreLayoutProps): JSX.Element;
    Route: (props: SubRoute) => null;
};
export {};
