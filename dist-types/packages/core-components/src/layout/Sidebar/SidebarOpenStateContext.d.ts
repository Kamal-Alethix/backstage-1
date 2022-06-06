import React, { ReactNode } from 'react';
/**
 * Types for the `SidebarContext`
 *
 * @public @deprecated
 * Use `SidebarOpenState` instead.
 */
export declare type SidebarContextType = {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
};
/**
 * The open state of the sidebar.
 *
 * @public
 */
export declare type SidebarOpenState = {
    /**
     * Whether or not the sidebar is open and full-width. When `false`, the
     * sidebar is "closed" and typically only shows icons with no text.
     */
    isOpen: boolean;
    /**
     * A function to set whether or not the sidebar is open. Pass `true` to open
     * the sidebar. Pass `false` to close it.
     */
    setOpen: (open: boolean) => void;
};
/**
 * Context whether the `Sidebar` is open
 *
 * @public @deprecated
 * Use `<SidebarOpenStateProvider>` + `useSidebarOpenState()` instead.
 */
export declare const LegacySidebarContext: React.Context<SidebarContextType>;
/**
 * Provides context for reading and updating sidebar state.
 *
 * @public
 */
export declare const SidebarOpenStateProvider: ({ children, value, }: {
    children: ReactNode;
    value: SidebarOpenState;
}) => JSX.Element;
/**
 * Hook to read and update the sidebar's open state, which controls whether or
 * not the sidebar is open and full-width, or closed and only displaying icons.
 *
 * @public
 */
export declare const useSidebarOpenState: () => SidebarOpenState;
