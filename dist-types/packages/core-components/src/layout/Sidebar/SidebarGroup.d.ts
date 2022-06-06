import { BottomNavigationActionProps } from '@material-ui/core/BottomNavigationAction';
import React from 'react';
/**
 * Props for the `SidebarGroup`
 *
 * @public
 */
export interface SidebarGroupProps extends BottomNavigationActionProps {
    /**
     * If the `SidebarGroup` should be a `Link`, `to` should be a pathname to that location
     */
    to?: string;
    /**
     * If the `SidebarGroup`s should be in a different order than in the normal `Sidebar`, you can provide
     * each `SidebarGroup` it's own priority to reorder them.
     */
    priority?: number;
    /**
     * React children
     */
    children?: React.ReactNode;
}
/**
 * Groups items of the `Sidebar` together.
 *
 * On bigger screens, this won't have any effect at the moment.
 * On small screens, it will add an action to the bottom navigation - either triggering an overlay menu or acting as a link
 *
 * @public
 */
export declare const SidebarGroup: (props: SidebarGroupProps) => JSX.Element;
