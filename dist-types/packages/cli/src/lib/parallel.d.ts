export declare type ParallelismOption = boolean | string | number | null | undefined;
export declare function parseParallelismOption(parallel: ParallelismOption): number;
export declare function getEnvironmentParallelism(): number;
declare type ParallelWorkerOptions<TItem> = {
    /**
     * Decides the number of parallel workers by multiplying
     * this with the configured parallelism, which defaults to 4.
     *
     * Defaults to 1.
     */
    parallelismFactor?: number;
    parallelismSetting?: ParallelismOption;
    items: Iterable<TItem>;
    worker: (item: TItem) => Promise<void>;
};
export declare function runParallelWorkers<TItem>(options: ParallelWorkerOptions<TItem>): Promise<void[]>;
export declare type WorkerQueueThreadsOptions<TItem, TResult, TData> = {
    /** The items to process */
    items: Iterable<TItem>;
    /**
     * A function that will be called within each worker thread at startup,
     * which should return the worker function that will be called for each item.
     *
     * This function must be defined as an arrow function or using the
     * function keyword, and must be entirely self contained, not referencing
     * any variables outside of its scope. This is because the function source
     * is stringified and evaluated in the worker thread.
     *
     * To pass data to the worker, use the `workerData` option and `items`, but
     * note that they are both copied by value into the worker thread, except for
     * types that are explicitly shareable across threads, such as `SharedArrayBuffer`.
     */
    workerFactory: (data: TData) => ((item: TItem) => Promise<TResult>) | Promise<(item: TItem) => Promise<TResult>>;
    /** Data supplied to each worker factory */
    workerData?: TData;
    /** Number of threads, defaults to half of the number of available CPUs */
    threadCount?: number;
};
/**
 * Spawns one or more worker threads using the `worker_threads` module.
 * Each thread processes one item at a time from the provided `options.items`.
 */
export declare function runWorkerQueueThreads<TItem, TResult, TData>(options: WorkerQueueThreadsOptions<TItem, TResult, TData>): Promise<TResult[]>;
export declare type WorkerThreadsOptions<TResult, TData, TMessage> = {
    /**
     * A function that is called by each worker thread to produce a result.
     *
     * This function must be defined as an arrow function or using the
     * function keyword, and must be entirely self contained, not referencing
     * any variables outside of its scope. This is because the function source
     * is stringified and evaluated in the worker thread.
     *
     * To pass data to the worker, use the `workerData` option, but
     * note that they are both copied by value into the worker thread, except for
     * types that are explicitly shareable across threads, such as `SharedArrayBuffer`.
     */
    worker: (data: TData, sendMessage: (message: TMessage) => void) => Promise<TResult>;
    /** Data supplied to each worker */
    workerData?: TData;
    /** Number of threads, defaults to 1 */
    threadCount?: number;
    /** An optional handler for messages posted from the worker thread */
    onMessage?: (message: TMessage) => void;
};
/**
 * Spawns one or more worker threads using the `worker_threads` module.
 */
export declare function runWorkerThreads<TResult, TData, TMessage>(options: WorkerThreadsOptions<TResult, TData, TMessage>): Promise<TResult[]>;
export {};
