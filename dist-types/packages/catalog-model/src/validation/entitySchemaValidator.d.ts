import { Entity } from '../entity/Entity';
/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to an {@link Entity} (or the given subtype) if it
 * matches that schema, or throws a {@link globals#TypeError} describing the errors.
 *
 * @remarks
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * By default, the plain {@link Entity} schema is used. If you pass in your own, it
 * may contain `$ref` references to the following, which are resolved
 * automatically for you:
 *
 * - {@link Entity}
 * - {@link EntityEnvelope}
 * - {@link EntityMeta}
 * - `common#<id>`
 *
 * @public
 * @see {@link https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema}
 */
export declare function entitySchemaValidator<T extends Entity = Entity>(schema?: unknown): (data: unknown) => T;
