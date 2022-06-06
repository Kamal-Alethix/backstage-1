import { EntityPagination } from '../../catalog/types';
/**
 * Parses the pagination related parameters out of a query, e.g.
 * /entities?offset=100&limit=10
 */
export declare function parseEntityPaginationParams(params: Record<string, unknown>): EntityPagination | undefined;
