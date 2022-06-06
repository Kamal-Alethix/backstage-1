/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const buildRouteRef: import("@backstage/core-plugin-api").SubRouteRef<import("@backstage/core-plugin-api").PathParams<"/builds/:jobFullName/:buildNumber">>;
export declare const jenkinsPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const EntityJenkinsContent: (_props: {}) => JSX.Element;
export declare const EntityLatestJenkinsRunCard: ({ branch, variant, }: {
    branch: string;
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
