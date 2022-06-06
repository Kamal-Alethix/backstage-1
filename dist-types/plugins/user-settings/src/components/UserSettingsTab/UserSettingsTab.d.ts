import { PropsWithChildren } from 'react';
/** @public */
export declare const USER_SETTINGS_TAB_KEY = "user-settings.tab";
/** @public */
export declare type UserSettingsTabProps = PropsWithChildren<{
    /**
     * The path to the tab in the settings route
     * @example `/settings/advanced`
     */
    path: string;
    /** The title of the tab. It will also reflect in the document title when the tab is active */
    title: string;
}>;
/**
 * Renders a tab inside the settings page
 * @param props - Component props
 * @public
 */
export declare const UserSettingsTab: (props: UserSettingsTabProps) => JSX.Element;
