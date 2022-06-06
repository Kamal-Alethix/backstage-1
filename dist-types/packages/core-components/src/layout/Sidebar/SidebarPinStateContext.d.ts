import React, { ReactNode } from 'react';
/**
 * Type of `SidebarPinStateContext`
 *
 * @public @deprecated
 * Use `SidebarPinState` instead.
 */
export declare type SidebarPinStateContextType = {
    isPinned: boolean;
    toggleSidebarPinState: () => any;
    isMobile?: boolean;
};
/**
 * The pin state of the sidebar.
 *
 * @public
 */
export declare type SidebarPinState = {
    /**
     * Whether or not the sidebar is pinned to the `open` state. When `isPinned`
     * is `false`, the sidebar opens and closes on hover. When `true`, the
     * sidebar is permanently opened, regardless of user interaction.
     */
    isPinned: boolean;
    /**
     * A function to toggle the pin state of the sidebar.
     */
    toggleSidebarPinState: () => any;
    /**
     * Whether or not the sidebar is or should be rendered in a mobile-optimized
     * way.
     */
    isMobile?: boolean;
};
/**
 * Contains the state on how the `Sidebar` is rendered
 *
 * @public @deprecated
 * Use `<SidebarPinStateContextProvider>` + `useSidebarPinState()` instead.
 */
export declare const LegacySidebarPinStateContext: React.Context<SidebarPinStateContextType>;
/**
 * Provides state for how the `Sidebar` is rendered
 *
 * @public
 */
export declare const SidebarPinStateProvider: ({ children, value, }: {
    children: ReactNode;
    value: SidebarPinStateContextType;
}) => JSX.Element;
/**
 * Hook to read and update sidebar pin state, which controls whether or not the
 * sidebar is pinned open.
 *
 * @public
 */
export declare const useSidebarPinState: () => SidebarPinState;
