import { ReactNode } from 'react';
/**
 * Holds a title for text Header of a sidebar submenu and children
 * components to be rendered inside SidebarSubmenu
 *
 * @public
 */
export declare type SidebarSubmenuProps = {
    title?: string;
    children: ReactNode;
};
/**
 * Used inside SidebarItem to display an expandable Submenu
 *
 * @public
 */
export declare const SidebarSubmenu: (props: SidebarSubmenuProps) => JSX.Element;
