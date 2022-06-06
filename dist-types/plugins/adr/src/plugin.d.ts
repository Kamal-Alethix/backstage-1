/// <reference types="react" />
/**
 * The Backstage plugin that holds ADR specific components
 * @public
 */
export declare const adrPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * An extension for browsing ADRs on an entity page.
 * @public
 */
export declare const EntityAdrContent: ({ contentDecorators, filePathFilterFn, }: {
    contentDecorators?: import(".").AdrContentDecorator[] | undefined;
    filePathFilterFn?: import("@backstage/plugin-adr-common").AdrFilePathFilterFn | undefined;
}) => JSX.Element;
