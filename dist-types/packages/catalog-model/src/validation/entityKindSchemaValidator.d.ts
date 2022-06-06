import { Entity } from '../entity';
/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to a `T` if it matches that schema, or `false` if the
 * schema apiVersion/kind didn't apply to that data, or throws a
 * {@link globals#TypeError} describing actual errors.
 *
 * @remarks
 *
 * This validator is highly specialized, in that it has special treatment of
 * the `kind` and `apiVersion` root keys. This only works if your schema has
 * their rule set to `"enum"`:
 *
 * ```
 * "apiVersion": {
 *    "enum": ["backstage.io/v1alpha1", "backstage.io/v1beta1"]
 * },
 * "kind": {
 *   "enum": ["Group"]
 * },
 * ```
 *
 * In the above example, the created validator will return `false` if and only
 * if the kind and/or apiVersion mismatch.
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * The given schema may contain `$ref` references to the following, which are
 * resolved automatically for you:
 *
 * - {@link Entity}
 *
 * - {@link EntityEnvelope}
 *
 * - {@link EntityMeta}
 *
 * - `common#<id>`
 * @see {@link https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema}
 *
 * @public
 */
export declare function entityKindSchemaValidator<T extends Entity>(schema: unknown): (data: unknown) => T | false;
