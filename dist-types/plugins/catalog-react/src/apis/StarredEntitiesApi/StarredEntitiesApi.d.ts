import { ApiRef } from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
/**
 * An API to store starred entities
 *
 * @public
 */
export declare const starredEntitiesApiRef: ApiRef<StarredEntitiesApi>;
/**
 * An API to store and retrieve starred entities
 *
 * @public
 */
export interface StarredEntitiesApi {
    /**
     * Toggle the star state of the entity
     *
     * @param entityRef - an entity reference to toggle
     */
    toggleStarred(entityRef: string): Promise<void>;
    /**
     * Observe the set of starred entity references.
     */
    starredEntitie$(): Observable<Set<string>>;
}
