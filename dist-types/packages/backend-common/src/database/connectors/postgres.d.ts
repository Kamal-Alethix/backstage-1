import { Knex } from 'knex';
import { Config } from '@backstage/config';
import { DatabaseConnector } from '../types';
/**
 * Creates a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function createPgDatabaseClient(dbConfig: Config, overrides?: Knex.Config): Knex<any, unknown[]>;
/**
 * Builds a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function buildPgDatabaseConfig(dbConfig: Config, overrides?: Knex.Config): any;
/**
 * Gets the postgres connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export declare function getPgConnectionConfig(dbConfig: Config, parseConnectionString?: boolean): Knex.PgConnectionConfig | string;
/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString - The postgres connection string
 */
export declare function parsePgConnectionString(connectionString: string): any;
/**
 * Creates the missing Postgres database if it does not exist
 *
 * @param dbConfig - The database config
 * @param databases - The name of the databases to create
 */
export declare function ensurePgDatabaseExists(dbConfig: Config, ...databases: Array<string>): Promise<void>;
/**
 * Creates the missing Postgres schema if it does not exist
 *
 * @param dbConfig - The database config
 * @param schemas - The name of the schemas to create
 */
export declare function ensurePgSchemaExists(dbConfig: Config, ...schemas: Array<string>): Promise<void>;
/**
 * PostgreSQL database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export declare const pgConnector: DatabaseConnector;
