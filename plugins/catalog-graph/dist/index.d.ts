/// <reference types="react" />
import { CompoundEntityRef } from '@backstage/catalog-model';
import * as _backstage_core_components from '@backstage/core-components';
import { DependencyGraphTypes } from '@backstage/core-components';
import { MouseEventHandler, MouseEvent } from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';

/**
 * A pair of two relations that describe the opposite of each other. The first
 * relation is considered as the primary relation.
 *
 * @public
 */
declare type RelationPairs = [string, string][];
/**
 * A list of pairs of entity relations, used to define which relations are
 * merged together and which the primary relation is.
 *
 * @public
 */
declare const ALL_RELATION_PAIRS: RelationPairs;

/**
 * Additional Data for entities.
 *
 * @public
 */
declare type EntityEdgeData = {
    /**
     * Up to two relations that are connecting an entity.
     */
    relations: string[];
    /**
     * Whether the entity is visible or not.
     */
    label: 'visible';
};
/**
 * Edge between two entities.
 *
 * @public
 */
declare type EntityEdge = DependencyGraphTypes.DependencyEdge<EntityEdgeData>;
/**
 * Additional data for Entity Node
 *
 * @public
 */
declare type EntityNodeData = {
    /**
     * Name of the entity.
     */
    name: string;
    /**
     * Optional kind of the entity.
     */
    kind?: string;
    /**
     * Optional title of the entity.
     */
    title?: string;
    /**
     * Namespace of the entity.
     */
    namespace: string;
    /**
     * Whether the entity is focused, optional, defaults to false. Focused
     * entities are highlighted in the graph.
     */
    focused?: boolean;
    /**
     * Optional color of the entity, defaults to 'default'.
     */
    color?: 'primary' | 'secondary' | 'default';
    /**
     * Optional click handler.
     */
    onClick?: MouseEventHandler<unknown>;
};
/**
 * Node representing an entity.
 *
 * @public
 */
declare type EntityNode = DependencyGraphTypes.DependencyNode<EntityNodeData>;
/**
 * Render direction of the graph.
 *
 * @public
 */
declare enum Direction {
    /**
     * Top to bottom.
     */
    TOP_BOTTOM = "TB",
    /**
     * Bottom to top.
     */
    BOTTOM_TOP = "BT",
    /**
     * Left to right.
     */
    LEFT_RIGHT = "LR",
    /**
     * Right to left.
     */
    RIGHT_LEFT = "RL"
}

/**
 * Core building block for custom entity relations diagrams.
 *
 * @public
 */
declare const EntityRelationsGraph: (props: {
    rootEntityNames: CompoundEntityRef | CompoundEntityRef[];
    maxDepth?: number | undefined;
    unidirectional?: boolean | undefined;
    mergeRelations?: boolean | undefined;
    kinds?: string[] | undefined;
    relations?: string[] | undefined;
    direction?: Direction | undefined;
    onNodeClick?: ((value: EntityNode, event: MouseEvent<unknown>) => void) | undefined;
    relationPairs?: RelationPairs | undefined;
    className?: string | undefined;
    zoom?: "disabled" | "enabled" | "enable-on-click" | undefined;
    renderNode?: DependencyGraphTypes.RenderNodeFunction<EntityNode> | undefined;
    renderLabel?: DependencyGraphTypes.RenderLabelFunction<EntityEdge> | undefined;
}) => JSX.Element;

/**
 * A card that displays the directly related entities to the current entity.
 *
 * @public
 */
declare const EntityCatalogGraphCard: (props: {
    variant?: _backstage_core_components.InfoCardVariants | undefined;
    relationPairs?: RelationPairs | undefined;
    maxDepth?: number | undefined;
    unidirectional?: boolean | undefined;
    mergeRelations?: boolean | undefined;
    kinds?: string[] | undefined;
    relations?: string[] | undefined;
    direction?: Direction | undefined;
    height?: number | undefined;
    title?: string | undefined;
    zoom?: "disabled" | "enabled" | "enable-on-click" | undefined;
}) => JSX.Element;
/**
 * A standalone page that can be added to your application providing a viewer
 * for your entities and their relations.
 *
 * @public
 */
declare const CatalogGraphPage: (props: {
    relationPairs?: RelationPairs | undefined;
    initialState?: {
        selectedRelations?: string[] | undefined;
        selectedKinds?: string[] | undefined;
        rootEntityRefs?: string[] | undefined;
        maxDepth?: number | undefined;
        unidirectional?: boolean | undefined;
        mergeRelations?: boolean | undefined;
        direction?: Direction | undefined;
        showFilters?: boolean | undefined;
    } | undefined;
}) => JSX.Element;

/**
 * Catalog Graph Plugin instance.
 * @public
 */
declare const catalogGraphPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    catalogGraph: _backstage_core_plugin_api.RouteRef<undefined>;
}, {
    catalogEntity: _backstage_core_plugin_api.ExternalRouteRef<{
        name: string;
        kind: string;
        namespace: string;
    }, true>;
}>;

/**
 * Route pointing to the standalone catalog graph page.
 *
 * @public
 */
declare const catalogGraphRouteRef: _backstage_core_plugin_api.RouteRef<undefined>;

export { ALL_RELATION_PAIRS, CatalogGraphPage, Direction, EntityCatalogGraphCard, EntityEdge, EntityEdgeData, EntityNode, EntityNodeData, EntityRelationsGraph, RelationPairs, catalogGraphPlugin, catalogGraphRouteRef };
