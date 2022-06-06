/// <reference types="react" />
import { Direction, RelationPairs } from '../EntityRelationsGraph';
export declare const CatalogGraphPage: (props: {
    relationPairs?: RelationPairs;
    initialState?: {
        selectedRelations?: string[];
        selectedKinds?: string[];
        rootEntityRefs?: string[];
        maxDepth?: number;
        unidirectional?: boolean;
        mergeRelations?: boolean;
        direction?: Direction;
        showFilters?: boolean;
    };
}) => JSX.Element;
