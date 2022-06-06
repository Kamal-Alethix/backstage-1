import { Entity } from '@backstage/catalog-model';
/**
 * Discover the graph of entities connected by relations, starting from a set of
 * root entities. Filters are used to select which relations to includes.
 * Returns all discovered entities once they are loaded.
 */
export declare function useEntityRelationGraph({ rootEntityRefs, filter: { maxDepth, relations, kinds }, }: {
    rootEntityRefs: string[];
    filter?: {
        maxDepth?: number;
        relations?: string[];
        kinds?: string[];
    };
}): {
    entities?: {
        [ref: string]: Entity;
    };
    loading: boolean;
    error?: Error;
};
