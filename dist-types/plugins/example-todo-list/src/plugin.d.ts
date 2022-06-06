/// <reference types="react" />
/**
 * The todo-list plugin instance
 *
 * @public
 */
export declare const todoListPlugin: import("@backstage/core-plugin-api").BackstagePlugin<{
    root: import("@backstage/core-plugin-api").RouteRef<undefined>;
}, {}>;
/**
 * The Router and main entrypoint to the todo-list plugin.
 *
 * @public
 */
export declare const TodoListPage: () => JSX.Element;
