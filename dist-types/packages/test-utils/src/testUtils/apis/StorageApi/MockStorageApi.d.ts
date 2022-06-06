import { StorageApi, StorageValueSnapshot } from '@backstage/core-plugin-api';
import { JsonValue, Observable } from '@backstage/types';
/**
 * Type for map holding data in {@link MockStorageApi}
 * @public
 */
export declare type MockStorageBucket = {
    [key: string]: any;
};
/**
 * Mock implementation of the {@link core-plugin-api#StorageApi} to be used in tests
 * @public
 */
export declare class MockStorageApi implements StorageApi {
    private readonly namespace;
    private readonly data;
    private readonly bucketStorageApis;
    private constructor();
    static create(data?: MockStorageBucket): MockStorageApi;
    forBucket(name: string): StorageApi;
    snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T>;
    set<T>(key: string, data: T): Promise<void>;
    remove(key: string): Promise<void>;
    observe$<T>(key: string): Observable<StorageValueSnapshot<T>>;
    private getKeyName;
    private notifyChanges;
    private subscribers;
    private readonly observable;
}
