import { CompoundEntityRef } from '@backstage/catalog-model';
import { Dispatch, DispatchWithoutAction } from 'react';
import { Direction } from '../EntityRelationsGraph';
export declare type CatalogGraphPageValue = {
    rootEntityNames: CompoundEntityRef[];
    setRootEntityNames: Dispatch<React.SetStateAction<CompoundEntityRef[]>>;
    maxDepth: number;
    setMaxDepth: Dispatch<React.SetStateAction<number>>;
    selectedRelations: string[] | undefined;
    setSelectedRelations: Dispatch<React.SetStateAction<string[] | undefined>>;
    selectedKinds: string[] | undefined;
    setSelectedKinds: Dispatch<React.SetStateAction<string[] | undefined>>;
    unidirectional: boolean;
    setUnidirectional: Dispatch<React.SetStateAction<boolean>>;
    mergeRelations: boolean;
    setMergeRelations: Dispatch<React.SetStateAction<boolean>>;
    direction: Direction;
    setDirection: Dispatch<React.SetStateAction<Direction>>;
    showFilters: boolean;
    toggleShowFilters: DispatchWithoutAction;
};
export declare function useCatalogGraphPage({ initialState, }: {
    initialState?: {
        selectedRelations?: string[] | undefined;
        selectedKinds?: string[] | undefined;
        rootEntityRefs?: string[];
        maxDepth?: number;
        unidirectional?: boolean;
        mergeRelations?: boolean;
        direction?: Direction;
        showFilters?: boolean;
    };
}): CatalogGraphPageValue;
