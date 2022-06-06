import { Entity } from '@backstage/catalog-model';
import { EntityFilter, UserListFilterKind } from './types';
/**
 * Filter entities based on Kind.
 * @public
 */
export declare class EntityKindFilter implements EntityFilter {
    readonly value: string;
    constructor(value: string);
    getCatalogFilters(): Record<string, string | string[]>;
    toQueryValue(): string;
}
/**
 * Filters entities based on type
 * @public
 */
export declare class EntityTypeFilter implements EntityFilter {
    readonly value: string | string[];
    constructor(value: string | string[]);
    getTypes(): string[];
    getCatalogFilters(): Record<string, string | string[]>;
    toQueryValue(): string[];
}
/**
 * Filters entities based on tag.
 * @public
 */
export declare class EntityTagFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}
/**
 * Filters entities where the text matches spec, title or tags.
 * @public
 */
export declare class EntityTextFilter implements EntityFilter {
    readonly value: string;
    constructor(value: string);
    filterEntity(entity: Entity): boolean;
}
/**
 * Filter matching entities that are owned by group.
 * @public
 */
export declare class EntityOwnerFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}
/**
 * Filters entities on lifecycle.
 * @public
 */
export declare class EntityLifecycleFilter implements EntityFilter {
    readonly values: string[];
    constructor(values: string[]);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string[];
}
/**
 * Filters entities based on whatever the user has starred or owns them.
 * @public
 */
export declare class UserListFilter implements EntityFilter {
    readonly value: UserListFilterKind;
    readonly isOwnedEntity: (entity: Entity) => boolean;
    readonly isStarredEntity: (entity: Entity) => boolean;
    constructor(value: UserListFilterKind, isOwnedEntity: (entity: Entity) => boolean, isStarredEntity: (entity: Entity) => boolean);
    filterEntity(entity: Entity): boolean;
    toQueryValue(): string;
}
