/// <reference types="react" />
export declare const rootCatalogKubernetesRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
export declare const kubernetesPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * Props of EntityKubernetesContent
 *
 * @public
 */
export declare type EntityKubernetesContentProps = {
    /**
     * Sets the refresh interval in milliseconds. The default value is 10000 (10 seconds)
     */
    refreshIntervalMs?: number;
};
export declare const EntityKubernetesContent: (props: EntityKubernetesContentProps) => JSX.Element;
