/// <reference types="react" />
/**
 * The Todo plugin instance.
 *
 * @public
 */
export declare const todoPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    entityContent: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * An extension for displaying the list of todos on an entity page.
 *
 * @public
 */
export declare const EntityTodoContent: () => JSX.Element;
