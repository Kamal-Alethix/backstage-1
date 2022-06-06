/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

/**
 * The todo-list plugin instance
 *
 * @public
 */
declare const todoListPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * The Router and main entrypoint to the todo-list plugin.
 *
 * @public
 */
declare const TodoListPage: () => JSX.Element;

export { TodoListPage, todoListPlugin };
