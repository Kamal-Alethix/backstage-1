import { Entity } from '../entity';
/**
 * Parses a string form location reference.
 *
 * @public
 * @param ref - A string-form location ref, e.g. `'url:https://host'`
 * @returns A location ref, e.g. `{ type: 'url', target: 'https://host' }`
 */
export declare function parseLocationRef(ref: string): {
    type: string;
    target: string;
};
/**
 * Turns a location ref into its string form.
 *
 * @public
 * @param ref - A location ref, e.g. `{ type: 'url', target: 'https://host' }`
 * @returns A string-form location ref, e.g. `'url:https://host'`
 */
export declare function stringifyLocationRef(ref: {
    type: string;
    target: string;
}): string;
/**
 * Returns the source code location of the Entity, to the extent that one exists.
 *
 * @remarks
 *
 * If the returned location type is of type 'url', the target should be readable at least
 * using the UrlReader from `@backstage/backend-common`. If it is not of type 'url', the caller
 * needs to have explicit handling of each location type or signal that it is not supported.
 *
 * @public
 */
export declare function getEntitySourceLocation(entity: Entity): {
    type: string;
    target: string;
};
