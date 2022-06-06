export declare type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
export declare type UnboxReturnedPromise<T extends (...args: any) => Promise<any>> = UnboxPromise<ReturnType<T>>;
export declare type UnboxArray<T> = T extends (infer U)[] ? U : T;
