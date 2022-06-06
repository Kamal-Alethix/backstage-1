import { TodoApi, TodoListOptions, TodoListResult } from './types';
import { DiscoveryApi, IdentityApi } from '@backstage/core-plugin-api';
/**
 * Options for creating a todo client.
 *
 * @public
 */
export interface TodoClientOptions {
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
}
/**
 * An implementation of the TodoApi that talks to the todo plugin backend.
 *
 * @public
 */
export declare class TodoClient implements TodoApi {
    private readonly discoveryApi;
    private readonly identityApi;
    constructor(options: TodoClientOptions);
    listTodos(options: TodoListOptions): Promise<TodoListResult>;
}
