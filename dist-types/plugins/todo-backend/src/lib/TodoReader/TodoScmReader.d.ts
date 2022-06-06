import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';
import { ReadTodosOptions, ReadTodosResult, TodoParser, TodoReader } from './types';
import { Config } from '@backstage/config';
/** @public */
export declare type TodoScmReaderOptions = {
    logger: Logger;
    reader: UrlReader;
    integrations: ScmIntegrations;
    parser?: TodoParser;
    filePathFilter?: (filePath: string) => boolean;
};
/** @public */
export declare class TodoScmReader implements TodoReader {
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
