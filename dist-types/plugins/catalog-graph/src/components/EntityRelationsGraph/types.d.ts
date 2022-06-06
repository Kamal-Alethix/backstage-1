import { DependencyGraphTypes } from '@backstage/core-components';
import { MouseEventHandler } from 'react';
/**
 * Additional Data for entities.
 *
 * @public
 */
export declare type EntityEdgeData = {
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
export declare type EntityEdge = DependencyGraphTypes.DependencyEdge<EntityEdgeData>;
/**
 * Additional data for Entity Node
 *
 * @public
 */
export declare type EntityNodeData = {
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
export declare type EntityNode = DependencyGraphTypes.DependencyNode<EntityNodeData>;
/**
 * Render direction of the graph.
 *
 * @public
 */
export declare enum Direction {
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
