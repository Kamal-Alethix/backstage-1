import { KeyStore, AnyJWK, StoredKey } from './types';
export declare class MemoryKeyStore implements KeyStore {
    private readonly keys;
    addKey(key: AnyJWK): Promise<void>;
    removeKeys(kids: string[]): Promise<void>;
    listKeys(): Promise<{
        items: StoredKey[];
    }>;
}
