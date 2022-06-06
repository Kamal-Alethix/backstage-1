/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { IconComponent, ApiRef, SessionApi, ProfileInfo } from '@backstage/core-plugin-api';
import { PropsWithChildren } from 'react';

declare const userSettingsPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    settingsPage: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
declare const UserSettingsPage: ({ providerSettings }: {
    providerSettings?: JSX.Element | undefined;
}) => JSX.Element;

declare type SettingsProps = {
    icon?: IconComponent;
};
declare const Settings: (props: SettingsProps) => JSX.Element;

declare type Props$4 = {
    providerSettings?: JSX.Element;
};
declare const SettingsPage: ({ providerSettings }: Props$4) => JSX.Element;

declare type Props$3 = {
    providerSettings?: JSX.Element;
};
declare const UserSettingsAuthProviders: ({ providerSettings }: Props$3) => JSX.Element;

declare type Props$2 = {
    configuredProviders: string[];
};
declare const DefaultProviderSettings: ({ configuredProviders }: Props$2) => JSX.Element;

declare type Props$1 = {
    title: string;
    description: string;
    icon: IconComponent;
    apiRef: ApiRef<SessionApi>;
};
declare const ProviderSettingsItem: ({ title, description, icon: Icon, apiRef, }: Props$1) => JSX.Element;

declare const UserSettingsGeneral: () => JSX.Element;

declare const UserSettingsProfileCard: () => JSX.Element;

declare const UserSettingsMenu: () => JSX.Element;

declare type Props = {
    size?: number;
};
declare const UserSettingsSignInAvatar: ({ size }: Props) => JSX.Element;

declare const UserSettingsAppearanceCard: () => JSX.Element;

declare const UserSettingsThemeToggle: () => JSX.Element;

declare const UserSettingsPinToggle: () => JSX.Element;

declare const UserSettingsFeatureFlags: () => JSX.Element;

declare const useUserProfile: () => {
    profile: ProfileInfo;
    displayName: string;
    loading: boolean;
};

/** @public */
declare const USER_SETTINGS_TAB_KEY = "user-settings.tab";
/** @public */
declare type UserSettingsTabProps = PropsWithChildren<{
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
declare const UserSettingsTab: (props: UserSettingsTabProps) => JSX.Element;

export { DefaultProviderSettings, ProviderSettingsItem, SettingsPage as Router, Settings, USER_SETTINGS_TAB_KEY, UserSettingsAppearanceCard, UserSettingsAuthProviders, UserSettingsFeatureFlags, UserSettingsGeneral, UserSettingsMenu, UserSettingsPage, UserSettingsPinToggle, UserSettingsProfileCard, UserSettingsSignInAvatar, UserSettingsTab, UserSettingsTabProps, UserSettingsThemeToggle, userSettingsPlugin as plugin, useUserProfile, userSettingsPlugin };
