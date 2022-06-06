import { TaskRunner } from '@backstage/backend-tasks';
import { DocumentCollatorFactory, DocumentDecoratorFactory, SearchEngine } from '@backstage/plugin-search-common';
import { Logger } from 'winston';
/**
 * Options required to instantiate the index builder.
 * @public
 */
export declare type IndexBuilderOptions = {
    searchEngine: SearchEngine;
    logger: Logger;
};
/**
 * Parameters required to register a collator.
 * @public
 */
export interface RegisterCollatorParameters {
    /**
     * The schedule for which the provided collator will be called, commonly the result of
     * {@link @backstage/backend-tasks#PluginTaskScheduler.createScheduledTaskRunner}
     */
    schedule: TaskRunner;
    /**
     * The class responsible for returning the document collator of the given type.
     */
    factory: DocumentCollatorFactory;
}
/**
 * Parameters required to register a decorator
 * @public
 */
export interface RegisterDecoratorParameters {
    /**
     * The class responsible for returning the decorator which appends, modifies, or filters documents.
     */
    factory: DocumentDecoratorFactory;
}
