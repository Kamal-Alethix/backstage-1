import { Entity } from '@backstage/catalog-model';
import { ReactNode } from 'react';
/** @public */
export declare type EntityLoadingStatus<TEntity extends Entity = Entity> = {
    entity?: TEntity;
    loading: boolean;
    error?: Error;
    refresh?: VoidFunction;
};
/**
 * Properties for the AsyncEntityProvider component.
 *
 * @public
 */
export interface AsyncEntityProviderProps {
    children: ReactNode;
    entity?: Entity;
    loading: boolean;
    error?: Error;
    refresh?: VoidFunction;
}
/**
 * Provides a loaded entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export declare const AsyncEntityProvider: ({ children, entity, loading, error, refresh, }: AsyncEntityProviderProps) => JSX.Element;
/**
 * Properties for the EntityProvider component.
 *
 * @public
 */
export interface EntityProviderProps {
    children: ReactNode;
    entity?: Entity;
}
/**
 * Provides an entity to be picked up by the `useEntity` hook.
 *
 * @public
 */
export declare const EntityProvider: (props: EntityProviderProps) => JSX.Element;
/**
 * Grab the current entity from the context, throws if the entity has not yet been loaded
 * or is not available.
 *
 * @public
 */
export declare function useEntity<TEntity extends Entity = Entity>(): {
    entity: TEntity;
};
/**
 * Grab the current entity from the context, provides loading state and errors, and the ability to refresh.
 *
 * @public
 */
export declare function useAsyncEntity<TEntity extends Entity = Entity>(): EntityLoadingStatus<TEntity>;
