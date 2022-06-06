import { Entity } from '@backstage/catalog-model';
/**
 * For use in EntitySwitch.Case. Matches if the entity is of a given kind.
 * @public
 */
export declare function isKind(kinds: string | string[]): (entity: Entity) => boolean;
/**
 * For use in EntitySwitch.Case. Matches if the entity is a Component of a given spec.type.
 * @public
 */
export declare function isComponentType(types: string | string[]): (entity: Entity) => boolean;
/**
 * For use in EntitySwitch.Case. Matches if the entity is in a given namespace.
 * @public
 */
export declare function isNamespace(namespaces: string | string[]): (entity: Entity) => boolean;
