/// <reference types="react" />
export declare const rootRouteRef: import("@backstage/core-plugin-api").RouteRef<undefined>;
/**
 * A plugin that helps the user in importing projects and YAML files into the
 * catalog.
 *
 * @public
 */
export declare const catalogImportPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    importPage: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * The page for importing projects and YAML files into the catalog.
 *
 * @public
 */
export declare const CatalogImportPage: () => JSX.Element;
