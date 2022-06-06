/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const viewAuditRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const createAuditRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const entityContentRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const lighthousePlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
export declare const LighthousePage: () => JSX.Element;
export declare const EntityLighthouseContent: (_props: {}) => JSX.Element;
export declare const EntityLastLighthouseAuditCard: ({ dense, variant, }: {
    dense?: boolean | undefined;
    variant?: import("@backstage/core-components").InfoCardVariants | undefined;
}) => JSX.Element;
