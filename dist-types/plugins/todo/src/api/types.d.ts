import { Entity } from '@backstage/catalog-model';
/**
 * TodoItem represents a single TODO comment in source code.
 *
 * @public
 */
export declare type TodoItem = {
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
export declare type TodoListFields = 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
/**
 * Options used to list todo items.
 *
 * @public
 */
export declare type TodoListOptions = {
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
export declare type TodoListResult = {
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
export interface TodoApi {
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
export declare const todoApiRef: import("@backstage/core-plugin-api").ApiRef<TodoApi>;
