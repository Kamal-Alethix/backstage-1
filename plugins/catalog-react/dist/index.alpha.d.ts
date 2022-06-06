/**
 * A frontend library that helps other Backstage plugins interact with the catalog
 *
 * @packageDocumentation
 */

/// <reference types="react" />

import { ApiRef } from '@backstage/core-plugin-api';
import { CATALOG_FILTER_EXISTS } from '@backstage/catalog-client';
import { CatalogApi } from '@backstage/catalog-client';
import { ComponentEntity } from '@backstage/catalog-model';
import { ComponentProps } from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { Entity } from '@backstage/catalog-model';
import { IconButton } from '@material-ui/core';
import { InfoCardVariants } from '@backstage/core-components';
import { LinkProps } from '@backstage/core-components';
import { Observable } from '@backstage/types';
import { Overrides } from '@material-ui/core/styles/overrides';
import { PropsWithChildren } from 'react';
import { default as React_2 } from 'react';
import { ReactNode } from 'react';
import { ResourcePermission } from '@backstage/plugin-permission-common';
import { RouteRef } from '@backstage/core-plugin-api';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { StyleRules } from '@material-ui/core/styles/withStyles';
import { SystemEntity } from '@backstage/catalog-model';
import { TableColumn } from '@backstage/core-components';

/**
 * Provides a loaded entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export declare const AsyncEntityProvider: ({ children, entity, loading, error, refresh, }: AsyncEntityProviderProps) => JSX.Element;

/**
 * Properties for the AsyncEntityProvider component.
 *
 * @public
 */
export declare interface AsyncEntityProviderProps {
    children: ReactNode;
    entity?: Entity;
    loading: boolean;
    error?: Error;
    refresh?: VoidFunction;
}

/** @public */
export declare type BackstageOverrides = Overrides & {
    [Name in keyof CatalogReactComponentsNameToClassKey]?: Partial<StyleRules<CatalogReactComponentsNameToClassKey[Name]>>;
};

export { CATALOG_FILTER_EXISTS }

export { CatalogApi }

/**
 * The API reference for the {@link @backstage/catalog-client#CatalogApi}.
 * @public
 */
export declare const catalogApiRef: ApiRef<CatalogApi>;

/** @public */
export declare const CatalogFilterLayout: {
    (props: {
        children: React_2.ReactNode;
    }): JSX.Element;
    Filters: (props: {
        children: React_2.ReactNode;
    }) => JSX.Element;
    Content: (props: {
        children: React_2.ReactNode;
    }) => JSX.Element;
};

/** @public */
export declare type CatalogReactComponentsNameToClassKey = {
    CatalogReactUserListPicker: CatalogReactUserListPickerClassKey;
    CatalogReactEntityLifecyclePicker: CatalogReactEntityLifecyclePickerClassKey;
    CatalogReactEntitySearchBar: CatalogReactEntitySearchBarClassKey;
    CatalogReactEntityTagPicker: CatalogReactEntityTagPickerClassKey;
    CatalogReactEntityOwnerPicker: CatalogReactEntityOwnerPickerClassKey;
};

/** @public */
export declare type CatalogReactEntityLifecyclePickerClassKey = 'input';

/** @public */
export declare type CatalogReactEntityOwnerPickerClassKey = 'input';

/** @public */
export declare type CatalogReactEntitySearchBarClassKey = 'searchToolbar' | 'input';

/** @public */
export declare type CatalogReactEntityTagPickerClassKey = 'input';

/** @public */
export declare type CatalogReactUserListPickerClassKey = 'root' | 'title' | 'listIcon' | 'menuItem' | 'groupWrapper';

/** @public */
export declare const columnFactories: Readonly<{
    createEntityRefColumn<T extends Entity>(options: {
        defaultKind?: string;
    }): TableColumn<T>;
    createEntityRelationColumn<T_1 extends Entity>({ title, relation, defaultKind, filter: entityFilter, }: {
        title: string;
        relation: string;
        defaultKind?: string | undefined;
        filter?: {
            kind: string;
        } | undefined;
    }): TableColumn<T_1>;
    createOwnerColumn<T_2 extends Entity>(): TableColumn<T_2>;
    createDomainColumn<T_3 extends Entity>(): TableColumn<T_3>;
    createSystemColumn<T_4 extends Entity>(): TableColumn<T_4>;
    createMetadataDescriptionColumn<T_5 extends Entity>(): TableColumn<T_5>;
    createSpecLifecycleColumn<T_6 extends Entity>(): TableColumn<T_6>;
    createSpecTypeColumn<T_7 extends Entity>(): TableColumn<T_7>;
}>;

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

/**
 * Filter entities based on Kind.
 * @public
 */
export declare class EntityKindFilter implements EntityFilter {
    readonly value: string;
    constructor(value: string);
    getCatalogFilters(): Record<string, string | string[]>;
    toQueryValue(): string;
}

/** @public */
export declare const EntityKindPicker: (props: EntityKindPickerProps) => JSX.Element | null;

/**
 * Props for {@link EntityKindPicker}.
 *
 * @public
 */
export declare interface EntityKindPickerProps {
    initialFilter?: string;
    hidden: boolean;
}

/**
 * Filters entities on lifecycle.
 * @public
 */
export declare class EntityLifecycleFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}

/** @public */
export declare const EntityLifecyclePicker: () => JSX.Element | null;

/**
 * Creates new context for entity listing and filtering.
 * @public
 */
export declare const EntityListContext: React_2.Context<EntityListContextProps<any> | undefined>;

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
 * Provides entities and filters for a catalog listing.
 * @public
 */
export declare const EntityListProvider: <EntityFilters extends DefaultEntityFilters>({ children, }: PropsWithChildren<{}>) => JSX.Element;

/** @public */
export declare type EntityLoadingStatus<TEntity extends Entity = Entity> = {
    entity?: TEntity;
    loading: boolean;
    error?: Error;
    refresh?: VoidFunction;
};

/**
 * Filter matching entities that are owned by group.
 * @public
 */
export declare class EntityOwnerFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}

/** @public */
export declare const EntityOwnerPicker: () => JSX.Element | null;

/**
 * Provides an entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export declare const EntityProvider: (props: EntityProviderProps) => JSX.Element;

/**
 * Properties for the EntityProvider component.
 *
 * @public
 */
export declare interface EntityProviderProps {
    children: ReactNode;
    entity?: Entity;
}

/**
 * Shows a clickable link to an entity.
 *
 * @public
 */
export declare const EntityRefLink: (props: EntityRefLinkProps) => JSX.Element;

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export declare type EntityRefLinkProps = {
    entityRef: Entity | CompoundEntityRef | string;
    defaultKind?: string;
    title?: string;
    children?: React_2.ReactNode;
} & Omit<LinkProps, 'to'>;

/**
 * Shows a list of clickable links to entities.
 *
 * @public
 */
export declare function EntityRefLinks(props: EntityRefLinksProps): JSX.Element;

/**
 * Props for {@link EntityRefLink}.
 *
 * @public
 */
export declare type EntityRefLinksProps = {
    entityRefs: (string | Entity | CompoundEntityRef)[];
    defaultKind?: string;
} & Omit<LinkProps, 'to'>;

/**
 * Utility function to get suitable route params for entityRoute, given an
 * @public
 */
export declare function entityRouteParams(entity: Entity): {
    readonly kind: string;
    readonly namespace: string;
    readonly name: string;
};

/**
 * A stable route ref that points to the catalog page for an individual entity.
 *
 * This `RouteRef` can be imported and used directly, and does not need to be referenced
 * via an `ExternalRouteRef`.
 *
 * If you want to replace the `EntityPage` from `@backstage/catalog-plugin` in your app,
 * you need to use the `entityRouteRef` as the mount point instead of your own.
 * @public
 */
export declare const entityRouteRef: RouteRef<    {
name: string;
kind: string;
namespace: string;
}>;

/**
 * Renders search bar for filtering the entity list.
 * @public
 */
export declare const EntitySearchBar: () => JSX.Element;

/** @public */
export declare type EntitySourceLocation = {
    locationTargetUrl: string;
    integrationType?: string;
};

/**
 * A general entity table component, that can be used for composing more
 * specific entity tables.
 *
 * @public
 */
export declare const EntityTable: {
    <T extends Entity>(props: EntityTableProps<T>): JSX.Element;
    columns: Readonly<{
        createEntityRefColumn<T_1 extends Entity>(options: {
            defaultKind?: string | undefined;
        }): TableColumn<T_1>;
        createEntityRelationColumn<T_2 extends Entity>({ title, relation, defaultKind, filter: entityFilter, }: {
            title: string;
            relation: string;
            defaultKind?: string | undefined;
            filter?: {
                kind: string;
            } | undefined;
        }): TableColumn<T_2>;
        createOwnerColumn<T_3 extends Entity>(): TableColumn<T_3>;
        createDomainColumn<T_4 extends Entity>(): TableColumn<T_4>;
        createSystemColumn<T_5 extends Entity>(): TableColumn<T_5>;
        createMetadataDescriptionColumn<T_6 extends Entity>(): TableColumn<T_6>;
        createSpecLifecycleColumn<T_7 extends Entity>(): TableColumn<T_7>;
        createSpecTypeColumn<T_8 extends Entity>(): TableColumn<T_8>;
    }>;
    systemEntityColumns: TableColumn<SystemEntity>[];
    componentEntityColumns: TableColumn<ComponentEntity>[];
};

/**
 * Props for {@link EntityTable}.
 *
 * @public
 */
export declare interface EntityTableProps<T extends Entity> {
    title: string;
    variant?: InfoCardVariants;
    entities: T[];
    emptyContent?: ReactNode;
    columns: TableColumn<T>[];
}

/**
 * Filters entities based on tag.
 * @public
 */
export declare class EntityTagFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}

/** @public */
export declare const EntityTagPicker: () => JSX.Element | null;

/**
 * Filters entities where the text matches spec, title or tags.
 * @public
 */
export declare class EntityTextFilter implements EntityFilter {
    readonly value: string;
    constructor(value: string);
    filterEntity(entity: Entity): boolean;
}

/**
 * Filters entities based on type
 * @public
 */
export declare class EntityTypeFilter implements EntityFilter {
    readonly value: string | string[];
    constructor(value: string | string[]);
    getTypes(): string[];
    getCatalogFilters(): Record<string, string | string[]>;
    toQueryValue(): string[];
}

/** @public */
export declare const EntityTypePicker: (props: EntityTypePickerProps) => JSX.Element | null;

/**
 * Props for {@link EntityTypePicker}.
 *
 * @public
 */
export declare interface EntityTypePickerProps {
    initialFilter?: string;
    hidden?: boolean;
}

/**
 * IconButton for showing if a current entity is starred and adding/removing it from the favorite entities
 * @param props - MaterialUI IconButton props extended by required `entity` prop
 * @public
 */
export declare const FavoriteEntity: (props: FavoriteEntityProps) => JSX.Element;

/** @public */
export declare type FavoriteEntityProps = ComponentProps<typeof IconButton> & {
    entity: Entity;
};

/**
 * Get the related entity references.
 *
 * @public
 */
export declare function getEntityRelations(entity: Entity | undefined, relationType: string, filter?: {
    kind: string;
}): CompoundEntityRef[];

/** @public */
export declare function getEntitySourceLocation(entity: Entity, scmIntegrationsApi: ScmIntegrationRegistry): EntitySourceLocation | undefined;

/** @public */
export declare function humanizeEntityRef(entityRef: Entity | CompoundEntityRef, opts?: {
    defaultKind?: string;
}): string;

/**
 * A dialog that lets users inspect the low level details of their entities.
 *
 * @public
 */
export declare function InspectEntityDialog(props: {
    open: boolean;
    entity: Entity;
    onClose: () => void;
}): JSX.Element | null;

/**
 * Returns true if the `owner` argument is a direct owner on the `entity` argument.
 *
 * @alpha
 * @remarks
 *
 * Note that this ownership is not the same as using the claims in the auth-resolver, it only will take into account ownership as expressed by direct entity relations.
 * It doesn't know anything about the additional groups that a user might belong to which the claims contain.
 */
export declare function isOwnerOf(owner: Entity, entity: Entity): boolean;

/** @public */
export declare const MockEntityListContextProvider: ({ children, value, }: React_2.PropsWithChildren<{
    value?: Partial<EntityListContextProps<DefaultEntityFilters>> | undefined;
}>) => JSX.Element;

/**
 * An in-memory mock implementation of the StarredEntitiesApi.
 *
 * @public
 */
export declare class MockStarredEntitiesApi implements StarredEntitiesApi {
    private readonly starredEntities;
    private readonly subscribers;
    private readonly observable;
    toggleStarred(entityRef: string): Promise<void>;
    starredEntitie$(): Observable<Set<string>>;
}

/**
 * An API to store and retrieve starred entities
 *
 * @public
 */
export declare interface StarredEntitiesApi {
    /**
     * Toggle the star state of the entity
     *
     * @param entityRef - an entity reference to toggle
     */
    toggleStarred(entityRef: string): Promise<void>;
    /**
     * Observe the set of starred entity references.
     */
    starredEntitie$(): Observable<Set<string>>;
}

/**
 * An API to store starred entities
 *
 * @public
 */
export declare const starredEntitiesApiRef: ApiRef<StarredEntitiesApi>;

/** @public */
export declare const UnregisterEntityDialog: (props: UnregisterEntityDialogProps) => JSX.Element;

/** @public */
export declare type UnregisterEntityDialogProps = {
    open: boolean;
    onConfirm: () => any;
    onClose: () => any;
    entity: Entity;
};

/**
 * Grab the current entity from the context, provides loading state and errors, and the ability to refresh.
 *
 * @public
 */
export declare function useAsyncEntity<TEntity extends Entity = Entity>(): EntityLoadingStatus<TEntity>;

/**
 * Grab the current entity from the context, throws if the entity has not yet been loaded
 * or is not available.
 *
 * @public
 */
export declare function useEntity<TEntity extends Entity = Entity>(): {
    entity: TEntity;
};

/**
 * Hook for interacting with the entity list context provided by the {@link EntityListProvider}.
 * @public
 */
export declare function useEntityList<EntityFilters extends DefaultEntityFilters = DefaultEntityFilters>(): EntityListContextProps<EntityFilters>;

/**
 * Returns a function that checks whether the currently signed-in user is an
 * owner of a given entity. When the hook is initially mounted, the loading
 * flag will be true and the results returned from the function will always be
 * false.
 *
 * @public
 *
 * @returns a function that checks if the signed in user owns an entity
 */
export declare function useEntityOwnership(): {
    loading: boolean;
    isOwnedEntity: (entity: Entity) => boolean;
};

/**
 * A thin wrapper around the
 * {@link @backstage/plugin-permission-react#usePermission} hook which uses the
 * current entity in context to make an authorization request for the given
 * {@link @backstage/plugin-catalog-common#CatalogEntityPermission}.
 *
 * Note: this hook blocks the permission request until the entity has loaded in
 * context. If you have the entityRef and need concurrent requests, use the
 * `usePermission` hook directly.
 * @alpha
 */
export declare function useEntityPermission(permission: ResourcePermission<'catalog-entity'>): {
    loading: boolean;
    allowed: boolean;
    error?: Error;
};

/**
 * A hook built on top of `useEntityList` for enabling selection of valid `spec.type` values
 * based on the selected EntityKindFilter.
 * @public
 */
export declare function useEntityTypeFilter(): {
    loading: boolean;
    error?: Error;
    availableTypes: string[];
    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;
};

/** @public */
export declare function useRelatedEntities(entity: Entity, relationFilter: {
    type?: string;
    kind?: string;
}): {
    entities: Entity[] | undefined;
    loading: boolean;
    error: Error | undefined;
};

/**
 * Filters entities based on whatever the user has starred or owns them.
 * @public
 */
export declare class UserListFilter implements EntityFilter {
    readonly value: UserListFilterKind;
    readonly isOwnedEntity: (entity: Entity) => boolean;
    readonly isStarredEntity: (entity: Entity) => boolean;
    constructor(value: UserListFilterKind, isOwnedEntity: (entity: Entity) => boolean, isStarredEntity: (entity: Entity) => boolean);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string;
}

/** @public */
export declare type UserListFilterKind = 'owned' | 'starred' | 'all';

/** @public */
export declare const UserListPicker: (props: UserListPickerProps) => JSX.Element;

/** @public */
export declare type UserListPickerProps = {
    initialFilter?: UserListFilterKind;
    availableFilters?: UserListFilterKind[];
};

/** @public */
export declare function useStarredEntities(): {
    starredEntities: Set<string>;
    toggleStarredEntity: (entityOrRef: Entity | CompoundEntityRef | string) => void;
    isStarredEntity: (entityOrRef: Entity | CompoundEntityRef | string) => boolean;
};

/** @public */
export declare function useStarredEntity(entityOrRef: Entity | CompoundEntityRef | string): {
    toggleStarredEntity: () => void;
    isStarredEntity: boolean;
};

export { }
