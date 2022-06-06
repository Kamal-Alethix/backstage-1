import { EntitiesSearchFilter, EntityFilter } from '../../catalog';
/**
 * Parses the filtering part of a query, like
 * /entities?filter=metadata.namespace=default,kind=Component
 */
export declare function parseEntityFilterParams(params: Record<string, unknown>): EntityFilter | undefined;
/**
 * Parses a single filter string as seen in a filter query, for example
 * metadata.namespace=default,kind=Component
 */
export declare function parseEntityFilterString(filterString: string): EntitiesSearchFilter[] | undefined;
