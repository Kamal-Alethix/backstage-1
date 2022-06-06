export declare function notEmpty<TValue>(value: TValue | null | undefined): value is TValue;
export declare function isUndefined(value: any): value is undefined;
export declare function isNull(value: any): boolean;
export declare function assertNever(x: never): never;
export declare function assertAlways<T>(argument: T | undefined): T;
export declare function findAlways<T>(collection: T[], callback: (el: T) => boolean): T;
export declare function findAnyKey<T>(record: Record<string, T> | undefined): string | undefined;
