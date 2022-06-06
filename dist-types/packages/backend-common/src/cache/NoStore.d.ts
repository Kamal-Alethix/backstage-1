/**
 * Storage class compatible with Keyv which always results in a no-op. This is
 * used when no cache store is configured in a Backstage backend instance.
 */
export declare class NoStore extends Map<string, any> {
    clear(): void;
    delete(_key: string): boolean;
    get(_key: string): void;
    has(_key: string): boolean;
    set(_key: string, _value: any): this;
}
