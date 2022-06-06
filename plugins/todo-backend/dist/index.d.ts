import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import express from 'express';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';

/** @public */
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
/** @public */
declare type ReadTodosOptions = {
    /**
     * Base URLs defining the root at which to search for TODOs
     */
    url: string;
};
/** @public */
declare type ReadTodosResult = {
    /**
     * TODO items found at the given locations
     */
    items: TodoItem[];
};
/** @public */
interface TodoReader {
    /**
     * Searches for TODO items in code at a given location
     */
    readTodos(options: ReadTodosOptions): Promise<ReadTodosResult>;
}
/** @public */
declare type TodoParserContext = {
    content: string;
    path: string;
};
/** @public */
declare type TodoParserResult = {
    text: string;
    tag: string;
    author?: string;
    lineNumber: number;
};
/** @public */
declare type TodoParser = (ctx: TodoParserContext) => TodoParserResult[];

/** @public */
declare type TodoScmReaderOptions = {
    logger: Logger;
    reader: UrlReader;
    integrations: ScmIntegrations;
    parser?: TodoParser;
    filePathFilter?: (filePath: string) => boolean;
};
/** @public */
declare class TodoScmReader implements TodoReader {
    private readonly logger;
    private readonly reader;
    private readonly parser;
    private readonly integrations;
    private readonly filePathFilter;
    private readonly cache;
    private readonly inFlightReads;
    static fromConfig(config: Config, options: Omit<TodoScmReaderOptions, 'integrations'>): TodoScmReader;
    constructor(options: TodoScmReaderOptions);
    readTodos(options: ReadTodosOptions): Promise<ReadTodosResult>;
    private doReadTodos;
}

/** @public */
declare type TodoParserOptions = {
    /** Custom tags to support in addition to TODO and FIXME */
    additionalTags?: string[];
};
/** @public */
declare function createTodoParser(options?: TodoParserOptions): TodoParser;

/** @public */
declare type ListTodosRequest = {
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
declare type ListTodosResponse = {
    items: TodoItem[];
    totalCount: number;
    offset: number;
    limit: number;
};
/** @public */
interface TodoService {
    listTodos(req: ListTodosRequest, options?: {
        token?: string;
    }): Promise<ListTodosResponse>;
}

/** @public */
interface RouterOptions {
    todoService: TodoService;
}
/** @public */
declare function createRouter(options: RouterOptions): Promise<express.Router>;

/** @public */
declare type TodoReaderServiceOptions = {
    todoReader: TodoReader;
    catalogClient: CatalogApi;
    maxPageSize?: number;
    defaultPageSize?: number;
};
/** @public */
declare class TodoReaderService implements TodoService {
    private readonly todoReader;
    private readonly catalogClient;
    private readonly maxPageSize;
    private readonly defaultPageSize;
    constructor(options: TodoReaderServiceOptions);
    listTodos(req: ListTodosRequest, options?: {
        token?: string;
    }): Promise<ListTodosResponse>;
}

export { ListTodosRequest, ListTodosResponse, ReadTodosOptions, ReadTodosResult, RouterOptions, TodoItem, TodoParser, TodoParserContext, TodoParserOptions, TodoParserResult, TodoReader, TodoReaderService, TodoReaderServiceOptions, TodoScmReader, TodoScmReaderOptions, TodoService, createRouter, createTodoParser };
