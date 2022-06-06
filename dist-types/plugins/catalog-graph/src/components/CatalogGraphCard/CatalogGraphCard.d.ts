/// <reference types="react" />
import { InfoCardVariants } from '@backstage/core-components';
import { Direction, RelationPairs } from '../EntityRelationsGraph';
export declare const CatalogGraphCard: (props: {
    variant?: InfoCardVariants;
    relationPairs?: RelationPairs;
    maxDepth?: number;
    unidirectional?: boolean;
    mergeRelations?: boolean;
    kinds?: string[];
    relations?: string[];
    direction?: Direction;
    height?: number;
    title?: string;
    zoom?: 'enabled' | 'disabled' | 'enable-on-click';
}) => JSX.Element;
