import { CatalogApi } from '@backstage/catalog-client';
import { TodoReader } from '../lib';
import { ListTodosRequest, ListTodosResponse, TodoService } from './types';
/** @public */
export declare type TodoReaderServiceOptions = {
    todoReader: TodoReader;
    catalogClient: CatalogApi;
    maxPageSize?: number;
    defaultPageSize?: number;
};
/** @public */
export declare class TodoReaderService implements TodoService {
    private readonly todoReader;
    private readonly catalogClient;
    private readonly maxPageSize;
    private readonly defaultPageSize;
    constructor(options: TodoReaderServiceOptions);
    listTodos(req: ListTodosRequest, options?: {
        token?: string;
    }): Promise<ListTodosResponse>;
}
