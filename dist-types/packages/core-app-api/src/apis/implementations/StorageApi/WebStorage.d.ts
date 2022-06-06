import { StorageApi, StorageValueSnapshot, ErrorApi } from '@backstage/core-plugin-api';
import { JsonValue, Observable } from '@backstage/types';
/**
 * An implementation of the storage API, that uses the browser's local storage.
 *
 * @public
 */
export declare class WebStorage implements StorageApi {
    private readonly namespace;
    private readonly errorApi;
    constructor(namespace: string, errorApi: ErrorApi);
    static create(options: {
        errorApi: ErrorApi;
        namespace?: string;
    }): WebStorage;
    get<T>(key: string): T | undefined;
    snapshot<T extends JsonValue>(key: string): StorageValueSnapshot<T>;
    forBucket(name: string): WebStorage;
    set<T>(key: string, data: T): Promise<void>;
    remove(key: string): Promise<void>;
    observe$<T>(key: string): Observable<StorageValueSnapshot<T>>;
    private getKeyName;
    private notifyChanges;
    private subscribers;
    private readonly observable;
}
