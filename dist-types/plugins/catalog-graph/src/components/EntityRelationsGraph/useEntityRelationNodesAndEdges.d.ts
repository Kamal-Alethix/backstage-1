import { MouseEvent } from 'react';
import { RelationPairs } from './relations';
import { EntityEdge, EntityNode } from './types';
/**
 * Generate nodes and edges to render the entity graph.
 */
export declare function useEntityRelationNodesAndEdges({ rootEntityRefs, maxDepth, unidirectional, mergeRelations, kinds, relations, onNodeClick, relationPairs, }: {
    rootEntityRefs: string[];
    maxDepth?: number;
    unidirectional?: boolean;
    mergeRelations?: boolean;
    kinds?: string[];
    relations?: string[];
    onNodeClick?: (value: EntityNode, event: MouseEvent<unknown>) => void;
    relationPairs?: RelationPairs;
}): {
    loading: boolean;
    nodes?: EntityNode[];
    edges?: EntityEdge[];
    error?: Error;
};
