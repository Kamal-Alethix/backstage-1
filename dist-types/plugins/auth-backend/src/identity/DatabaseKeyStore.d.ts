import { Knex } from 'knex';
import { AnyJWK, KeyStore, StoredKey } from './types';
declare type Options = {
    database: Knex;
};
export declare class DatabaseKeyStore implements KeyStore {
    static create(options: Options): Promise<DatabaseKeyStore>;
    private readonly database;
    private constructor();
    addKey(key: AnyJWK): Promise<void>;
    listKeys(): Promise<{
        items: StoredKey[];
    }>;
    removeKeys(kids: string[]): Promise<void>;
}
export {};
