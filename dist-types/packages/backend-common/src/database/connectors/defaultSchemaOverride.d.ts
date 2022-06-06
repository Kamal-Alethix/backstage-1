import { Knex } from 'knex';
/**
 * Provides a partial knex config with schema name override.
 *
 * @param name - schema name to get config override for
 */
export default function defaultSchemaOverride(name: string): Partial<Knex.Config>;
