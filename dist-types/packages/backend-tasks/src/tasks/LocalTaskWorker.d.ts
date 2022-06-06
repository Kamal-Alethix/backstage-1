import { AbortSignal } from 'node-abort-controller';
import { Logger } from 'winston';
import { TaskFunction, TaskSettingsV2 } from './types';
/**
 * Implements tasks that run locally without cross-host collaboration.
 *
 * @private
 */
export declare class LocalTaskWorker {
    private readonly taskId;
    private readonly fn;
    private readonly logger;
    private abortWait;
    constructor(taskId: string, fn: TaskFunction, logger: Logger);
    start(settings: TaskSettingsV2, options?: {
        signal?: AbortSignal;
    }): void;
    trigger(): void;
    /**
     * Makes a single attempt at running the task to completion.
     */
    private runOnce;
    /**
     * Sleeps until it's time to run the task again.
     */
    private waitUntilNext;
    private sleep;
}
