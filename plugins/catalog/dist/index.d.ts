/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { StorageApi, IconComponent, ApiHolder } from '@backstage/core-plugin-api';
import { StarredEntitiesApi, UserListFilterKind } from '@backstage/plugin-catalog-react';
import { Observable } from '@backstage/types';
import { InfoCardVariants, TableColumn, TableProps } from '@backstage/core-components';
import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
import * as React$1 from 'react';
import React__default, { ReactNode } from 'react';
import { IndexableDocument, ResultHighlight } from '@backstage/plugin-search-common';
import { TabProps } from '@material-ui/core';
import { Overrides } from '@material-ui/core/styles/overrides';
import { StyleRules } from '@material-ui/core/styles/withStyles';

/**
 * Default implementation of the StarredEntitiesApi that is backed by the StorageApi.
 *
 * @public
 */
declare class DefaultStarredEntitiesApi implements StarredEntitiesApi {
    private readonly settingsStore;
    private starredEntities;
    constructor(opts: {
        storageApi: StorageApi;
    });
    toggleStarred(entityRef: string): Promise<void>;
    starredEntitie$(): Observable<Set<string>>;
    private readonly subscribers;
    private readonly observable;
    private notifyChanges;
}

/**
 * Props for {@link EntityAboutCard}.
 *
 * @public
 */
interface AboutCardProps {
    variant?: InfoCardVariants;
}

/**
 * Props for {@link AboutContent}.
 *
 * @public
 */
interface AboutContentProps {
    entity: Entity;
}
/** @public */
declare function AboutContent(props: AboutContentProps): JSX.Element;

/**
 * Props for {@link AboutField}.
 *
 * @public
 */
interface AboutFieldProps {
    label: string;
    value?: string;
    gridSizes?: Record<string, number>;
    children?: React__default.ReactNode;
}
/** @public */
declare function AboutField(props: AboutFieldProps): JSX.Element;

/**
 * Props for {@link CatalogKindHeader}.
 *
 * @public
 */
interface CatalogKindHeaderProps {
    /**
     * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
     * displayed.
     */
    allowedKinds?: string[];
    /**
     * The initial kind to select; defaults to 'component'. A kind filter entered directly in the
     * query parameter will override this value.
     */
    initialFilter?: string;
}
/** @public */
declare function CatalogKindHeader(props: CatalogKindHeaderProps): JSX.Element;

/**
 * Props for {@link CatalogSearchResultListItem}.
 *
 * @public
 */
interface CatalogSearchResultListItemProps {
    result: IndexableDocument;
    highlight?: ResultHighlight;
}
/** @public */
declare function CatalogSearchResultListItem(props: CatalogSearchResultListItemProps): JSX.Element;

/** @public */
interface CatalogTableRow {
    entity: Entity;
    resolved: {
        name: string;
        partOfSystemRelationTitle?: string;
        partOfSystemRelations: CompoundEntityRef[];
        ownedByRelationsTitle?: string;
        ownedByRelations: CompoundEntityRef[];
    };
}

/**
 * Props for {@link CatalogTable}.
 *
 * @public
 */
interface CatalogTableProps {
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
    tableOptions?: TableProps<CatalogTableRow>['options'];
}
/** @public */
declare const CatalogTable: {
    (props: CatalogTableProps): JSX.Element;
    columns: Readonly<{
        createNameColumn(options?: {
            defaultKind?: string | undefined;
        } | undefined): TableColumn<CatalogTableRow>;
        createSystemColumn(): TableColumn<CatalogTableRow>;
        createOwnerColumn(): TableColumn<CatalogTableRow>;
        createSpecTypeColumn(): TableColumn<CatalogTableRow>;
        createSpecLifecycleColumn(): TableColumn<CatalogTableRow>;
        createMetadataDescriptionColumn(): TableColumn<CatalogTableRow>;
        createTagsColumn(): TableColumn<CatalogTableRow>;
    }>;
};

/** @public */
declare type EntityLayoutRouteProps = {
    path: string;
    title: string;
    children: JSX.Element;
    if?: (entity: Entity) => boolean;
    tabProps?: TabProps<React__default.ElementType, {
        component?: React__default.ElementType;
    }>;
};
interface ExtraContextMenuItem {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
}
interface contextMenuOptions {
    disableUnregister: boolean;
}
/** @public */
interface EntityLayoutProps {
    UNSTABLE_extraContextMenuItems?: ExtraContextMenuItem[];
    UNSTABLE_contextMenuOptions?: contextMenuOptions;
    children?: React__default.ReactNode;
    NotFoundComponent?: React__default.ReactNode;
}
/**
 * EntityLayout is a compound component, which allows you to define a layout for
 * entities using a sub-navigation mechanism.
 *
 * Consists of two parts: EntityLayout and EntityLayout.Route
 *
 * @example
 * ```jsx
 * <EntityLayout>
 *   <EntityLayout.Route path="/example" title="Example tab">
 *     <div>This is rendered under /example/anything-here route</div>
 *   </EntityLayout.Route>
 * </EntityLayout>
 * ```
 *
 * @public
 */
declare const EntityLayout: {
    (props: EntityLayoutProps): JSX.Element;
    Route: (props: EntityLayoutRouteProps) => null;
};

/**
 * Returns true if the given entity has the orphan annotation given by the
 * catalog.
 *
 * @public
 */
declare function isOrphan(entity: Entity): boolean;
/**
 * Displays a warning alert if the entity is marked as orphan with the ability
 * to delete said entity.
 *
 * @public
 */
declare function EntityOrphanWarning(): JSX.Element;

/**
 * Returns true if the given entity has any processing errors on it.
 *
 * @public
 */
declare function hasCatalogProcessingErrors(entity: Entity, context: {
    apis: ApiHolder;
}): Promise<boolean>;
/**
 * Displays a list of errors from the ancestors of the current entity.
 *
 * @public
 */
declare function EntityProcessingErrorsPanel(): JSX.Element | null;

/** @public */
interface EntitySwitchCaseProps {
    if?: (entity: Entity, context: {
        apis: ApiHolder;
    }) => boolean | Promise<boolean>;
    children: ReactNode;
}
/**
 * Props for the {@link EntitySwitch} component.
 * @public
 */
interface EntitySwitchProps {
    children: ReactNode;
}
/** @public */
declare const EntitySwitch: {
    (props: EntitySwitchProps): JSX.Element | null;
    Case: (_props: EntitySwitchCaseProps) => null;
};

/**
 * For use in EntitySwitch.Case. Matches if the entity is of a given kind.
 * @public
 */
declare function isKind(kinds: string | string[]): (entity: Entity) => boolean;
/**
 * For use in EntitySwitch.Case. Matches if the entity is a Component of a given spec.type.
 * @public
 */
declare function isComponentType(types: string | string[]): (entity: Entity) => boolean;
/**
 * For use in EntitySwitch.Case. Matches if the entity is in a given namespace.
 * @public
 */
declare function isNamespace(namespaces: string | string[]): (entity: Entity) => boolean;

/**
 * @public
 * @deprecated Use `CatalogFilterLayout` from `@backstage/plugin-catalog-react` instead.
 */
declare const FilteredEntityLayout: (props: {
    children: React.ReactNode;
}) => JSX.Element;
/**
 * @public
 * @deprecated Use `CatalogFilterLayout.Filters` from `@backstage/plugin-catalog-react` instead.
 */
declare const FilterContainer: (props: {
    children: React$1.ReactNode;
}) => JSX.Element;
/**
 * @public
 * @deprecated Use `CatalogFilterLayout.Content` from `@backstage/plugin-catalog-react` instead.
 */
declare const EntityListContainer: (props: {
    children: React$1.ReactNode;
}) => JSX.Element;

declare type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
declare type ColumnBreakpoints = Record<Breakpoint, number>;

/** @public */
interface EntityLinksCardProps {
    cols?: ColumnBreakpoints | number;
    variant?: InfoCardVariants;
}
declare function EntityLinksCard$1(props: EntityLinksCardProps): JSX.Element;

/** @public */
declare type EntityLinksEmptyStateClassKey = 'code';

/** @public */
declare type SystemDiagramCardClassKey = 'domainNode' | 'systemNode' | 'componentNode' | 'apiNode' | 'resourceNode';

/** @public */
declare type PluginCatalogComponentsNameToClassKey = {
    PluginCatalogEntityLinksEmptyState: EntityLinksEmptyStateClassKey;
    PluginCatalogSystemDiagramCard: SystemDiagramCardClassKey;
};
/** @public */
declare type BackstageOverrides = Overrides & {
    [Name in keyof PluginCatalogComponentsNameToClassKey]?: Partial<StyleRules<PluginCatalogComponentsNameToClassKey[Name]>>;
};

/**
 * Props for root catalog pages.
 *
 * @public
 */
interface DefaultCatalogPageProps {
    initiallySelectedFilter?: UserListFilterKind;
    columns?: TableColumn<CatalogTableRow>[];
    actions?: TableProps<CatalogTableRow>['actions'];
    initialKind?: string;
    tableOptions?: TableProps<CatalogTableRow>['options'];
}

/** @public */
interface DependencyOfComponentsCardProps {
    variant?: InfoCardVariants;
    title?: string;
}

/** @public */
interface DependsOnComponentsCardProps {
    variant?: InfoCardVariants;
    title?: string;
}

/** @public */
interface DependsOnResourcesCardProps {
    variant?: InfoCardVariants;
}

/** @public */
interface HasComponentsCardProps {
    variant?: InfoCardVariants;
}

/** @public */
interface HasResourcesCardProps {
    variant?: InfoCardVariants;
}

/** @public */
interface HasSubcomponentsCardProps {
    variant?: InfoCardVariants;
}

/** @public */
interface HasSystemsCardProps {
    variant?: InfoCardVariants;
}

/** @public */
declare type RelatedEntitiesCardProps<T extends Entity> = {
    variant?: InfoCardVariants;
    title: string;
    columns: TableColumn<T>[];
    entityKind?: string;
    relationType: string;
    emptyMessage: string;
    emptyHelpLink: string;
    asRenderableEntities: (entities: Entity[]) => T[];
};

/** @public */
declare const catalogPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    catalogIndex: _backstage_core_plugin_api.RouteRef<undefined>;
    catalogEntity: _backstage_core_plugin_api.RouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }>;
}, {
    createComponent: _backstage_core_plugin_api.ExternalRouteRef<undefined, true>;
    viewTechDoc: _backstage_core_plugin_api.ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;
/** @public */
declare const CatalogIndexPage: (props: DefaultCatalogPageProps) => JSX.Element;
/** @public */
declare const CatalogEntityPage: () => JSX.Element;
/** @public */
declare const EntityAboutCard: (props: AboutCardProps) => JSX.Element;
/** @public */
declare const EntityLinksCard: typeof EntityLinksCard$1;
/** @public */
declare const EntityHasSystemsCard: (props: HasSystemsCardProps) => JSX.Element;
/** @public */
declare const EntityHasComponentsCard: (props: HasComponentsCardProps) => JSX.Element;
/** @public */
declare const EntityHasSubcomponentsCard: (props: HasSubcomponentsCardProps) => JSX.Element;
/** @public */
declare const EntityHasResourcesCard: (props: HasResourcesCardProps) => JSX.Element;
/** @public */
declare const EntityDependsOnComponentsCard: (props: DependsOnComponentsCardProps) => JSX.Element;
/** @public */
declare const EntityDependencyOfComponentsCard: (props: DependencyOfComponentsCardProps) => JSX.Element;
/** @public */
declare const EntityDependsOnResourcesCard: (props: DependsOnResourcesCardProps) => JSX.Element;
/** @public */
declare const RelatedEntitiesCard: <T extends Entity>(props: RelatedEntitiesCardProps<T>) => JSX.Element;

export { AboutCardProps, AboutContent, AboutContentProps, AboutField, AboutFieldProps, BackstageOverrides, CatalogEntityPage, CatalogIndexPage, CatalogKindHeader, CatalogKindHeaderProps, CatalogSearchResultListItem, CatalogSearchResultListItemProps, CatalogTable, CatalogTableProps, CatalogTableRow, DefaultCatalogPageProps, DefaultStarredEntitiesApi, DependencyOfComponentsCardProps, DependsOnComponentsCardProps, DependsOnResourcesCardProps, EntityAboutCard, EntityDependencyOfComponentsCard, EntityDependsOnComponentsCard, EntityDependsOnResourcesCard, EntityHasComponentsCard, EntityHasResourcesCard, EntityHasSubcomponentsCard, EntityHasSystemsCard, EntityLayout, EntityLayoutProps, EntityLayoutRouteProps, EntityLinksCard, EntityLinksCardProps, EntityLinksEmptyStateClassKey, EntityListContainer, EntityOrphanWarning, EntityProcessingErrorsPanel, EntitySwitch, EntitySwitchCaseProps, EntitySwitchProps, FilterContainer, FilteredEntityLayout, HasComponentsCardProps, HasResourcesCardProps, HasSubcomponentsCardProps, HasSystemsCardProps, PluginCatalogComponentsNameToClassKey, RelatedEntitiesCard, RelatedEntitiesCardProps, SystemDiagramCardClassKey, catalogPlugin, hasCatalogProcessingErrors, isComponentType, isKind, isNamespace, isOrphan };
