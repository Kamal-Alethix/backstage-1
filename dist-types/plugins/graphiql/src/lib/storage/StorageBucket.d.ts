export declare class StorageBucket implements Storage {
    private readonly storage;
    private readonly bucket;
    private static noPropAccessProxyHandler;
    static forStorage(storage: Storage, bucket: string): StorageBucket;
    static forLocalStorage(bucket: string): StorageBucket;
    private constructor();
    [name: string]: any;
    get length(): number;
    clear(): void;
    getItem(key: string): string | null;
    key(): never;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
    private read;
    private write;
}
