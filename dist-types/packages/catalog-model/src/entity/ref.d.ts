import { CompoundEntityRef } from '../types';
import { Entity } from './Entity';
/**
 * Extracts the kind, namespace and name that form the compound entity ref
 * triplet of the given entity.
 *
 * @public
 * @param entity - An entity
 * @returns The compound entity ref
 */
export declare function getCompoundEntityRef(entity: Entity): CompoundEntityRef;
/**
 * Parses an entity reference, either on string or compound form, and returns
 * a structure with a name, and optional kind and namespace.
 *
 * @remarks
 *
 * The context object can contain default values for the kind and namespace,
 * that will be used if the input reference did not specify any.
 *
 * @public
 * @param ref - The reference to parse
 * @param context - The context of defaults that the parsing happens within
 * @returns The compound form of the reference
 */
export declare function parseEntityRef(ref: string | {
    kind?: string;
    namespace?: string;
    name: string;
}, context?: {
    /** The default kind, if none is given in the reference */
    defaultKind?: string;
    /** The default namespace, if none is given in the reference */
    defaultNamespace?: string;
}): CompoundEntityRef;
/**
 * Takes an entity or entity name/reference, and returns the string form of an
 * entity ref.
 *
 * @remarks
 *
 * This function creates a canonical and unique reference to the entity, converting
 * all parts of the name to lowercase and inserts the default namespace if needed.
 * It is typically not the best way to represent the entity reference to the user.
 *
 * @public
 * @param ref - The reference to serialize
 * @returns The same reference on either string or compound form
 */
export declare function stringifyEntityRef(ref: Entity | {
    kind: string;
    namespace?: string;
    name: string;
}): string;
