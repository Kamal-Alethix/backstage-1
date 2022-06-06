import { Config } from '@backstage/config';
import { Knex } from 'knex';
import { DatabaseConnector } from '../types';
/**
 * Creates a knex SQLite3 database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function createSqliteDatabaseClient(dbConfig: Config, overrides?: Knex.Config): Knex<any, unknown[]>;
/**
 * Builds a knex SQLite3 connection config
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function buildSqliteDatabaseConfig(dbConfig: Config, overrides?: Knex.Config): Knex.Config;
/**
 * Provides a partial knex SQLite3 config to override database name.
 */
export declare function createSqliteNameOverride(name: string): Partial<Knex.Config>;
/**
 * Produces a partial knex SQLite3 connection config with database name.
 */
export declare function parseSqliteConnectionString(name: string): Knex.Sqlite3ConnectionConfig;
/**
 * SQLite3 database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export declare const sqlite3Connector: DatabaseConnector;
