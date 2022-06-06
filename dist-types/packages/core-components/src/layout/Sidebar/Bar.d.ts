import React from 'react';
import { SidebarOptions, SubmenuOptions } from './config';
/** @public */
export declare type SidebarClassKey = 'drawer' | 'drawerOpen';
/** @public */
export declare type SidebarProps = {
    openDelayMs?: number;
    closeDelayMs?: number;
    sidebarOptions?: SidebarOptions;
    submenuOptions?: SubmenuOptions;
    disableExpandOnHover?: boolean;
    children?: React.ReactNode;
};
export declare type DesktopSidebarProps = {
    openDelayMs?: number;
    closeDelayMs?: number;
    disableExpandOnHover?: boolean;
    children?: React.ReactNode;
};
/**
 * Passing children into the desktop or mobile sidebar depending on the context
 *
 * @public
 */
export declare const Sidebar: (props: SidebarProps) => JSX.Element;
