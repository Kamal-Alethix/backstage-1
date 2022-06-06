import express from 'express';
import { TodoService } from './types';
/** @public */
export interface RouterOptions {
    todoService: TodoService;
}
/** @public */
export declare function createRouter(options: RouterOptions): Promise<express.Router>;
export declare function parseIntegerParam(str: unknown, ctx: string): number | undefined;
export declare function parseOrderByParam<T extends readonly string[]>(str: unknown, allowedFields: T): {
    field: T[number];
    direction: 'asc' | 'desc';
} | undefined;
export declare function parseFilterParam<T extends readonly string[]>(str: unknown, allowedFields: T): {
    field: T[number];
    value: string;
}[] | undefined;
