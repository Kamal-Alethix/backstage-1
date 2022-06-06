import { DocumentTypeInfo, SearchEngine } from '@backstage/plugin-search-common';
import { Scheduler } from './Scheduler';
import { IndexBuilderOptions, RegisterCollatorParameters, RegisterDecoratorParameters } from './types';
/**
 * Used for adding collators, decorators and compile them into tasks which are added to a scheduler returned to the caller.
 * @public
 */
export declare class IndexBuilder {
    private collators;
    private decorators;
    private documentTypes;
    private searchEngine;
    private logger;
    constructor({ logger, searchEngine }: IndexBuilderOptions);
    /**
     * Responsible for returning the registered search engine.
     */
    getSearchEngine(): SearchEngine;
    /**
     * Responsible for returning the registered document types.
     */
    getDocumentTypes(): Record<string, DocumentTypeInfo>;
    /**
     * Makes the index builder aware of a collator that should be executed at the
     * given refresh interval.
     */
    addCollator({ factory, schedule }: RegisterCollatorParameters): void;
    /**
     * Makes the index builder aware of a decorator. If no types are provided on
     * the decorator, it will be applied to documents from all known collators,
     * otherwise it will only be applied to documents of the given types.
     */
    addDecorator({ factory }: RegisterDecoratorParameters): void;
    /**
     * Compiles collators and decorators into tasks, which are added to a
     * scheduler returned to the caller.
     */
    build(): Promise<{
        scheduler: Scheduler;
    }>;
}
