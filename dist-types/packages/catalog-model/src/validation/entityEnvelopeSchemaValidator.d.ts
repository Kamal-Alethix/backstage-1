import { EntityEnvelope } from '../entity/EntityEnvelope';
/**
 * Creates a validation function that takes some arbitrary data, and either
 * returns that data cast to an {@link EntityEnvelope} (or the given subtype)
 * if it matches that schema, or throws a {@link globals#TypeError} describing the
 * errors.
 *
 * @remarks
 *
 * Note that this validator is only meant for applying the base schema checks;
 * it does not take custom policies or additional processor based validation
 * into account.
 *
 * By default, the plain `EntityEnvelope` schema is used. If you pass in your
 * own, it may contain `$ref` references to the following, which are resolved
 * automatically for you:
 *
 * - {@link EntityEnvelope}
 * - {@link Entity}
 * - {@link EntityMeta}
 * - `common#<id>`
 *
 * See also {@link https://github.com/backstage/backstage/tree/master/packages/catalog-model/src/schema}
 *
 * @public
 *
 */
export declare function entityEnvelopeSchemaValidator<T extends EntityEnvelope = EntityEnvelope>(schema?: unknown): (data: unknown) => T;
