/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

/**
 * TodoItem represents a single TODO comment in source code.
 *
 * @public
 */
declare type TodoItem = {
    /** The contents of the TODO comment */
    text: string;
    /** The tag used, e.g. TODO, FIXME */
    tag: string;
    /** References author, if any */
    author?: string;
    /** URL used to view the file */
    viewUrl?: string;
    /** The line number of the file that the TODO occurs at */
    lineNumber?: number;
    /** The path of the file containing the TODO within the repo */
    repoFilePath?: string;
};
/**
 * Fields that can be used to filter or order todo items.
 *
 * @public
 */
declare type TodoListFields = 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
/**
 * Options used to list todo items.
 *
 * @public
 */
declare type TodoListOptions = {
    entity?: Entity;
    offset?: number;
    limit?: number;
    orderBy?: {
        field: TodoListFields;
        direction: 'asc' | 'desc';
    };
    filters?: {
        field: TodoListFields;
        /** Value to filter by, with '*' used as wildcard */
        value: string;
    }[];
};
/**
 * The result of listing todos.
 *
 * @public
 */
declare type TodoListResult = {
    items: TodoItem[];
    totalCount: number;
    offset: number;
    limit: number;
};
/**
 * The API used by the todo-plugin to list todos.
 *
 * @public
 */
interface TodoApi {
    /**
     * Lists todo items.
     *
     * @public
     */
    listTodos(options: TodoListOptions): Promise<TodoListResult>;
}
/**
 * ApiRef for the TodoApi.
 *
 * @public
 */
declare const todoApiRef: _backstage_core_plugin_api.ApiRef<TodoApi>;

/**
 * Options for creating a todo client.
 *
 * @public
 */
interface TodoClientOptions {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
}
/**
 * An implementation of the TodoApi that talks to the todo plugin backend.
 *
 * @public
 */
declare class TodoClient implements TodoApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: TodoClientOptions);
    listTodos(options: TodoListOptions): Promise<TodoListResult>;
}

/**
 * The Todo plugin instance.
 *
 * @public
 */
declare const todoPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    entityContent: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}>;
/**
 * An extension for displaying the list of todos on an entity page.
 *
 * @public
 */
declare const EntityTodoContent: () => JSX.Element;

export { EntityTodoContent, TodoApi, TodoClient, TodoClientOptions, TodoItem, TodoListFields, TodoListOptions, TodoListResult, todoApiRef, todoPlugin };
