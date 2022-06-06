import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
/**
 * Creates a knex database connection
 *
 * @public
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function createDatabaseClient(dbConfig: Config, overrides?: Partial<Knex.Config>): Knex<any, any[]>;
/**
 * Ensures that the given databases all exist, creating them if they do not.
 *
 * @public
 */
export declare function ensureDatabaseExists(dbConfig: Config, ...databases: Array<string>): Promise<void>;
/**
 * Ensures that the given schemas all exist, creating them if they do not.
 *
 * @public
 */
export declare function ensureSchemaExists(dbConfig: Config, ...schemas: Array<string>): Promise<void>;
/**
 * Provides a `Knex.Config` object with the provided database name for a given
 * client.
 */
export declare function createNameOverride(client: string, name: string): Partial<Knex.Config>;
/**
 * Provides a `Knex.Config` object with the provided database schema for a given
 * client. Currently only supported by `pg`.
 */
export declare function createSchemaOverride(client: string, name: string): Partial<Knex.Config | undefined>;
/**
 * Parses a connection string for a given client and provides a connection config.
 */
export declare function parseConnectionString(connectionString: string, client?: string): Knex.StaticConnectionConfig;
/**
 * Normalizes a connection config or string into an object which can be passed
 * to Knex.
 */
export declare function normalizeConnection(connection: Knex.StaticConnectionConfig | JsonObject | string | undefined, client: string): Partial<Knex.StaticConnectionConfig>;
