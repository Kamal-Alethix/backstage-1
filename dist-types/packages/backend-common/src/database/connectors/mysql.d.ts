import { Knex } from 'knex';
import { Config } from '@backstage/config';
import { DatabaseConnector } from '../types';
/**
 * Creates a knex mysql database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function createMysqlDatabaseClient(dbConfig: Config, overrides?: Knex.Config): Knex<any, unknown[]>;
/**
 * Builds a knex mysql database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export declare function buildMysqlDatabaseConfig(dbConfig: Config, overrides?: Knex.Config): any;
/**
 * Gets the mysql connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export declare function getMysqlConnectionConfig(dbConfig: Config, parseConnectionString?: boolean): Knex.MySqlConnectionConfig | string;
/**
 * Parses a mysql connection string.
 *
 * e.g. mysql://examplename:somepassword@examplehost:3306/dbname
 * @param connectionString - The mysql connection string
 */
export declare function parseMysqlConnectionString(connectionString: string): Knex.MySqlConnectionConfig;
/**
 * Creates the missing mysql database if it does not exist
 *
 * @param dbConfig - The database config
 * @param databases - The names of the databases to create
 */
export declare function ensureMysqlDatabaseExists(dbConfig: Config, ...databases: Array<string>): Promise<void>;
/**
 * MySQL database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export declare const mysqlConnector: DatabaseConnector;
