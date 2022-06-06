import { Knex } from 'knex';
/**
 * Provides a partial knex config with database name override.
 *
 * Default override for knex database drivers which accept ConnectionConfig
 * with `connection.database` as the database name field.
 *
 * @param name - database name to get config override for
 */
export default function defaultNameOverride(name: string): Partial<Knex.Config>;
