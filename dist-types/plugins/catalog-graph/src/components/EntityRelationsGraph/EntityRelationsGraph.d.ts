import { CompoundEntityRef } from '@backstage/catalog-model';
import { DependencyGraphTypes } from '@backstage/core-components';
import { MouseEvent } from 'react';
import { RelationPairs } from './relations';
import { Direction, EntityEdge, EntityNode } from './types';
/**
 * Core building block for custom entity relations diagrams.
 *
 * @public
 */
export declare const EntityRelationsGraph: (props: {
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
