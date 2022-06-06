import { StorageApi } from '@backstage/core-plugin-api';
import { StarredEntitiesApi } from '@backstage/plugin-catalog-react';
import { Observable } from '@backstage/types';
/**
 * Default implementation of the StarredEntitiesApi that is backed by the StorageApi.
 *
 * @public
 */
export declare class DefaultStarredEntitiesApi implements StarredEntitiesApi {
    private readonly settingsStore;
    private starredEntities;
    constructor(opts: {
        storageApi: StorageApi;
    });
    toggleStarred(entityRef: string): Promise<void>;
    starredEntitie$(): Observable<Set<string>>;
    private readonly subscribers;
    private readonly observable;
    private notifyChanges;
}
