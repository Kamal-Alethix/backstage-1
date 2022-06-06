import { CompoundEntityRef } from '@backstage/catalog-model';
import { TodoItem } from '../lib';
/** @public */
export declare type ListTodosRequest = {
    entity?: CompoundEntityRef;
    offset?: number;
    limit?: number;
    orderBy?: {
        field: 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
        direction: 'asc' | 'desc';
    };
    filters?: {
        field: 'text' | 'tag' | 'author' | 'viewUrl' | 'repoFilePath';
        /** Value to filter by, with '*' used as wildcard */
        value: string;
    }[];
};
/** @public */
export declare type ListTodosResponse = {
    items: TodoItem[];
    totalCount: number;
    offset: number;
    limit: number;
};
/** @public */
export interface TodoService {
    listTodos(req: ListTodosRequest, options?: {
        token?: string;
    }): Promise<ListTodosResponse>;
}
