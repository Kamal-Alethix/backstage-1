import { Entity, CompoundEntityRef } from '@backstage/catalog-model';
/**
 * Each distinct state that the dialog can be in at any given time.
 */
export declare type UseUnregisterEntityDialogState = {
    type: 'loading';
} | {
    type: 'error';
    error: Error;
} | {
    type: 'bootstrap';
    location: string;
    deleteEntity: () => Promise<void>;
} | {
    type: 'unregister';
    location: string;
    colocatedEntities: CompoundEntityRef[];
    unregisterLocation: () => Promise<void>;
    deleteEntity: () => Promise<void>;
} | {
    type: 'only-delete';
    deleteEntity: () => Promise<void>;
};
/**
 * Houses the main logic for unregistering entities and their locations.
 */
export declare function useUnregisterEntityDialogState(entity: Entity): UseUnregisterEntityDialogState;
