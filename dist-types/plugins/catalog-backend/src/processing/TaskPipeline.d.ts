declare type Options<T> = {
    /**
     * The callback used to load in new tasks. The number of items returned
     * in the array must be at most `count` number of items, but may be lower.
     *
     * Any error thrown from this method fill be treated as an unhandled rejection.
     */
    loadTasks: (count: number) => Promise<Array<T>>;
    /**
     * The callback used to process a single item.
     *
     * Any error thrown from this method fill be treated as an unhandled rejection.
     */
    processTask: (item: T) => Promise<void>;
    /**
     * The target minimum number of items to process in parallel. Once the number
     * of in-flight tasks reaches this count, more tasks will be loaded in.
     */
    lowWatermark: number;
    /**
     * The maximum number of items to process in parallel.
     */
    highWatermark: number;
    /**
     * The interval at which tasks are polled for in the background when
     * there aren't enough tasks to load to satisfy the low watermark.
     *
     * @default 1000
     */
    pollingIntervalMs?: number;
};
/**
 * Creates a task processing pipeline which continuously loads in tasks to
 * keep the number of parallel in-flight tasks between a low and high watermark.
 *
 * @param options - The options for the pipeline.
 * @returns A stop function which when called halts all processing.
 */
export declare function startTaskPipeline<T>(options: Options<T>): () => void;
export {};
