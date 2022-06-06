import { Entity } from '@backstage/catalog-model';
/** @public */
export declare type EntityFilter = {
    /**
     * Get filters to add to the catalog-backend request. These are a dot-delimited field with
     * value(s) to accept, extracted on the backend by parseEntityFilterParams. For example:
     *   `{ field: 'kind', values: ['component'] }`
     *   `{ field: 'metadata.name', values: ['component-1', 'component-2'] }`
     */
    getCatalogFilters?: () => Record<string, string | symbol | (string | symbol)[]>;
    /**
     * Filter entities on the frontend after a catalog-backend request. This function will be called
     * with each backend-resolved entity. This is used when frontend information is required for
     * filtering, such as a user's starred entities.
     */
    filterEntity?: (entity: Entity) => boolean;
    /**
     * Serialize the filter value to a string for query params. The UI component responsible for
     * handling this filter should retrieve this from useEntityList.queryParameters. The
     * value restored should be in the precedence: queryParameters `>` initialValue prop `>` default.
     */
    toQueryValue?: () => string | string[];
};
/** @public */
export declare type UserListFilterKind = 'owned' | 'starred' | 'all';
