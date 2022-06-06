import { Entity } from '@backstage/catalog-model';
import React, { PropsWithChildren } from 'react';
import { EntityKindFilter, EntityLifecycleFilter, EntityOwnerFilter, EntityTagFilter, EntityTextFilter, EntityTypeFilter, UserListFilter } from '../filters';
/** @public */
export declare type DefaultEntityFilters = {
    kind?: EntityKindFilter;
    type?: EntityTypeFilter;
    user?: UserListFilter;
    owners?: EntityOwnerFilter;
    lifecycles?: EntityLifecycleFilter;
    tags?: EntityTagFilter;
    text?: EntityTextFilter;
};
/** @public */
export declare type EntityListContextProps<EntityFilters extends DefaultEntityFilters = DefaultEntityFilters> = {
    /**
     * The currently registered filters, adhering to the shape of DefaultEntityFilters or an extension
     * of that default (to add custom filter types).
     */
    filters: EntityFilters;
    /**
     * The resolved list of catalog entities, after all filters are applied.
     */
    entities: Entity[];
    /**
     * The resolved list of catalog entities, after _only catalog-backend_ filters are applied.
     */
    backendEntities: Entity[];
    /**
     * Update one or more of the registered filters. Optional filters can be set to `undefined` to
     * reset the filter.
     */
    updateFilters: (filters: Partial<EntityFilters> | ((prevFilters: EntityFilters) => Partial<EntityFilters>)) => void;
    /**
     * Filter values from query parameters.
     */
    queryParameters: Partial<Record<keyof EntityFilters, string | string[]>>;
    loading: boolean;
    error?: Error;
};
/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export declare const EntityListContext: React.Context<EntityListContextProps<any> | undefined>;
/**
 * Provides entities and filters for a catalog listing.
 * @public
 */
export declare const EntityListProvider: <EntityFilters extends DefaultEntityFilters>({ children, }: PropsWithChildren<{}>) => JSX.Element;
/**
 * Hook for interacting with the entity list context provided by the {@link EntityListProvider}.
 * @public
 */
export declare function useEntityList<EntityFilters extends DefaultEntityFilters = DefaultEntityFilters>(): EntityListContextProps<EntityFilters>;
