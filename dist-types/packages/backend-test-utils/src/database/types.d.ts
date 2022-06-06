import { DatabaseManager } from '@backstage/backend-common';
import { Knex } from 'knex';
/**
 * The possible databases to test against.
 *
 * @public
 */
export declare type TestDatabaseId = 'POSTGRES_13' | 'POSTGRES_9' | 'MYSQL_8' | 'SQLITE_3';
export declare type TestDatabaseProperties = {
    name: string;
    driver: string;
    dockerImageName?: string;
    connectionStringEnvironmentVariableName?: string;
};
export declare type Instance = {
    stopContainer?: () => Promise<void>;
    databaseManager: DatabaseManager;
    connections: Array<Knex>;
};
export declare const allDatabases: Record<TestDatabaseId, TestDatabaseProperties>;
