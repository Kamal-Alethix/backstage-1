/// <reference types="react" />
export declare const cloudbuildPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const EntityCloudbuildContent: () => JSX.Element;
export declare const EntityLatestCloudbuildRunCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;
export declare const EntityLatestCloudbuildsForBranchCard: ({ branch, }: {
    branch: string;
}) => JSX.Element;
