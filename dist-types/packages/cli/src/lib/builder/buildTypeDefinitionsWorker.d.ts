/**
 * NOTE: This is a worker thread function that is stringified and executed
 *       within a `worker_threads.Worker`. Everything in this function must
 *       be self-contained.
 *       Using TypeScript is fine as it is transpiled before being stringified.
 */
export declare function buildTypeDefinitionsWorker(workerData: any, sendMessage: (message: any) => void): Promise<void>;
