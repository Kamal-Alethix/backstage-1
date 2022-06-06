/// <reference types="react" />
export declare const settingsRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const userSettingsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    settingsPage: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const UserSettingsPage: ({ providerSettings }: {
    providerSettings?: JSX.Element | undefined;
}) => JSX.Element;
