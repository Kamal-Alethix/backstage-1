import React, { PropsWithChildren, ReactNode } from 'react';
import { TabProps } from '@material-ui/core/Tab';
declare type SubRoute = {
    path: string;
    title: string;
    children: JSX.Element;
    tabProps?: TabProps<React.ElementType, {
        component?: React.ElementType;
    }>;
};
export declare function createSubRoutesFromChildren(childrenProps: ReactNode): SubRoute[];
/**
 * TabbedLayout is a compound component, which allows you to define a layout for
 * pages using a sub-navigation mechanism.
 *
 * Consists of two parts: TabbedLayout and TabbedLayout.Route
 *
 * @example
 * ```jsx
 * <TabbedLayout>
 *   <TabbedLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </TabbedLayout.Route>
 * </TabbedLayout>
 * ```
 */
export declare function TabbedLayout(props: PropsWithChildren<{}>): JSX.Element;
export declare namespace TabbedLayout {
    var Route: (props: SubRoute) => null;
}
export {};
