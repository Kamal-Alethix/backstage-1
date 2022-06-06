import React from 'react';
/**
 * Props of MobileSidebar
 *
 * @public
 */
export declare type MobileSidebarProps = {
    children?: React.ReactNode;
};
/**
 * A navigation component for mobile screens, which sticks to the bottom.
 *
 * It alternates the normal sidebar by grouping the `SidebarItems` based on provided `SidebarGroup`s
 * either rendering them as a link or an overlay menu.
 * If no `SidebarGroup`s are provided the sidebar content is wrapped in an default overlay menu.
 *
 * @public
 */
export declare const MobileSidebar: (props: MobileSidebarProps) => JSX.Element | null;
