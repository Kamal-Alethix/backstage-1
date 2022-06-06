/// <reference types="node" />
import { IndexableDocument, DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { Logger } from 'winston';

/**
 * Extended IndexableDocument with stack overflow specific properties
 *
 * @public
 */
interface StackOverflowDocument extends IndexableDocument {
    answers: number;
    tags: string[];
}
/**
 * Type representing the request parameters accepted by the {@link StackOverflowQuestionsCollatorFactory}
 *
 * @public
 */
declare type StackOverflowQuestionsRequestParams = {
    [key: string]: string | string[] | number;
};
/**
 * Options for {@link StackOverflowQuestionsCollatorFactory}
 *
 * @public
 */
declare type StackOverflowQuestionsCollatorFactoryOptions = {
    baseUrl?: string;
    requestParams: StackOverflowQuestionsRequestParams;
    logger: Logger;
};
/**
 * Search collator responsible for collecting stack overflow questions to index.
 *
 * @public
 */
declare class StackOverflowQuestionsCollatorFactory implements DocumentCollatorFactory {
    protected requestParams: StackOverflowQuestionsRequestParams;
    private readonly baseUrl;
    private readonly logger;
    readonly type: string;
    private constructor();
    static fromConfig(config: Config, options: StackOverflowQuestionsCollatorFactoryOptions): StackOverflowQuestionsCollatorFactory;
    getCollator(): Promise<Readable>;
    execute(): AsyncGenerator<StackOverflowDocument>;
}

export { StackOverflowDocument, StackOverflowQuestionsCollatorFactory, StackOverflowQuestionsCollatorFactoryOptions, StackOverflowQuestionsRequestParams };
