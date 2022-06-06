/**
 * A library for Backstage backend plugins that want to interact with the search backend plugin
 *
 * @packageDocumentation
 */
export { IndexBuilder } from './IndexBuilder';
export { Scheduler } from './Scheduler';
export * from './collators';
export { LunrSearchEngine } from './engines';
export type { ConcreteLunrQuery, LunrQueryTranslator, LunrSearchEngineIndexer, } from './engines';
export type { IndexBuilderOptions, RegisterCollatorParameters, RegisterDecoratorParameters, } from './types';
export * from './indexing';
export * from './test-utils';
export type { ScheduleTaskParameters } from './Scheduler';
/**
 * @deprecated Import from @backstage/plugin-search-common instead
 */
export type { SearchEngine } from '@backstage/plugin-search-common';
