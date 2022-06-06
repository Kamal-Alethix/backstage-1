import { Observable } from '@backstage/types';
import { StarredEntitiesApi } from './StarredEntitiesApi';
/**
 * An in-memory mock implementation of the StarredEntitiesApi.
 *
 * @public
 */
export declare class MockStarredEntitiesApi implements StarredEntitiesApi {
    private readonly starredEntities;
    private readonly subscribers;
    private readonly observable;
    toggleStarred(entityRef: string): Promise<void>;
    starredEntitie$(): Observable<Set<string>>;
}
