/// <reference types="react" />
/**
 * @public
 */
export declare const codescenePlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
    projectPage: import("@backstage/core-plugin-api").RouteRef<{
        projectId: string;
    }>;
}, {}>;
/**
 * @public
 */
export declare const CodeScenePage: () => JSX.Element;
/**
 * @public
 */
export declare const CodeSceneProjectDetailsPage: () => JSX.Element;
