import { Entity } from '@backstage/catalog-model';
import { Dispatch } from 'react';
/**
 * Ensures that a set of requested entities is loaded.
 */
export declare function useEntityStore(): {
    entities: {
        [ref: string]: Entity;
    };
    loading: boolean;
    error?: Error;
    requestEntities: Dispatch<string[]>;
};
