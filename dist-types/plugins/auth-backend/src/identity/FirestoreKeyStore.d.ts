import { Logger } from 'winston';
import { Settings } from '@google-cloud/firestore';
import { AnyJWK, KeyStore, StoredKey } from './types';
export declare type FirestoreKeyStoreSettings = Settings & Options;
declare type Options = {
    path?: string;
    timeout?: number;
};
export declare const DEFAULT_TIMEOUT_MS = 10000;
export declare const DEFAULT_DOCUMENT_PATH = "sessions";
export declare class FirestoreKeyStore implements KeyStore {
    private readonly database;
    private readonly path;
    private readonly timeout;
    static create(settings?: FirestoreKeyStoreSettings): Promise<FirestoreKeyStore>;
    private constructor();
    static verifyConnection(keyStore: FirestoreKeyStore, logger?: Logger): Promise<void>;
    addKey(key: AnyJWK): Promise<void>;
    listKeys(): Promise<{
        items: StoredKey[];
    }>;
    removeKeys(kids: string[]): Promise<void>;
    /**
     * Helper function to allow us to modify the timeout used when
     * performing Firestore database operations.
     *
     * The reason for this is that it seems that there's no other
     * practical solution to change the default timeout of 10mins
     * that Firestore has.
     *
     */
    private withTimeout;
    /**
     * Used to verify that the database is reachable.
     */
    private verify;
}
export {};
