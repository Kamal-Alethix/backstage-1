import { BackstageTheme } from '@backstage/theme';
/**
 * A Backstage sidebar object that contains properties such as its pin state.
 */
declare type BackstageSidebar = {
    /** Tracks whether the user pinned the sidebar or not. */
    isPinned: boolean;
};
/**
 * A dependencies object injected into rules by the style processor.
 */
export declare type RuleOptions = {
    /**
     * A Backstage theme object that contains the application's design tokens.
     */
    theme: BackstageTheme;
    /**
     * A Backstage sidebar, see {@link BackstageSidebar} for more details.
     */
    sidebar: BackstageSidebar;
};
export {};
