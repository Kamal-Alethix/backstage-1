/// <reference types="react" />
export declare const gitopsProfilesPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    listPage: import("@backstage/core-plugin-api").RouteRef<undefined>;
    detailsPage: import("@backstage/core-plugin-api").RouteRef<{
        owner: string;
        repo: string;
    }>;
    createPage: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const GitopsProfilesClusterListPage: () => JSX.Element;
export declare const GitopsProfilesClusterPage: () => JSX.Element;
export declare const GitopsProfilesCreatePage: () => JSX.Element;
