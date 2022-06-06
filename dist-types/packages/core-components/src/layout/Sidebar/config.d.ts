import { Dispatch, SetStateAction } from 'react';
/** @public **/
export declare type SidebarOptions = {
    drawerWidthClosed?: number;
    drawerWidthOpen?: number;
};
/** @public **/
export declare type SubmenuOptions = {
    drawerWidthClosed?: number;
    drawerWidthOpen?: number;
};
export declare const sidebarConfig: {
    drawerWidthClosed: number;
    drawerWidthOpen: number;
    defaultOpenDelayMs: number;
    defaultCloseDelayMs: number;
    defaultFadeDuration: number;
    logoHeight: number;
    iconContainerWidth: number;
    iconSize: number;
    iconPadding: number;
    selectedIndicatorWidth: number;
    userBadgePadding: number;
    userBadgeDiameter: number;
    mobileSidebarHeight: number;
};
export declare const makeSidebarConfig: (customSidebarConfig: Partial<SidebarOptions>) => {
    iconContainerWidth: number;
    iconSize: number;
    userBadgeDiameter: number;
    drawerWidthClosed: number;
    drawerWidthOpen: number;
    defaultOpenDelayMs: number;
    defaultCloseDelayMs: number;
    defaultFadeDuration: number;
    logoHeight: number;
    iconPadding: number;
    selectedIndicatorWidth: number;
    userBadgePadding: number;
    mobileSidebarHeight: number;
};
export declare const submenuConfig: {
    drawerWidthClosed: number;
    drawerWidthOpen: number;
    defaultOpenDelayMs: number;
};
export declare const makeSidebarSubmenuConfig: (customSubmenuConfig: Partial<SubmenuOptions>) => {
    drawerWidthClosed: number;
    drawerWidthOpen: number;
    defaultOpenDelayMs: number;
};
export declare const SIDEBAR_INTRO_LOCAL_STORAGE = "@backstage/core/sidebar-intro-dismissed";
export declare type SidebarConfigContextType = {
    sidebarConfig: SidebarConfig;
    submenuConfig: SubmenuConfig;
};
export declare const SidebarConfigContext: import("react").Context<SidebarConfigContextType>;
export declare type SidebarItemWithSubmenuContextType = {
    isHoveredOn: boolean;
    setIsHoveredOn: Dispatch<SetStateAction<boolean>>;
};
export declare const SidebarItemWithSubmenuContext: import("react").Context<SidebarItemWithSubmenuContextType>;
