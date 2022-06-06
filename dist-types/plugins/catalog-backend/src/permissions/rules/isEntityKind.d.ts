import { Entity } from '@backstage/catalog-model';
import { EntitiesSearchFilter } from '../../catalog/types';
/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified kind.
 * @alpha
 */
export declare const isEntityKind: import("@backstage/plugin-permission-node").PermissionRule<Entity, EntitiesSearchFilter, "catalog-entity", [kinds: string[]]>;
