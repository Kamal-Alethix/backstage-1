/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * Returns true if the given entity has the orphan annotation given by the
 * catalog.
 *
 * @public
 */
export declare function isOrphan(entity: Entity): boolean;
/**
 * Displays a warning alert if the entity is marked as orphan with the ability
 * to delete said entity.
 *
 * @public
 */
export declare function EntityOrphanWarning(): JSX.Element;
