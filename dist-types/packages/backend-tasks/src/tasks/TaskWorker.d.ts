import { Knex } from 'knex';
import { Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';
import { Logger } from 'winston';
import { TaskFunction, TaskSettingsV2 } from './types';
/**
 * Implements tasks that run across worker hosts, with collaborative locking.
 *
 * @private
 */
export declare class TaskWorker {
    private readonly taskId;
    private readonly fn;
    private readonly knex;
    private readonly logger;
    private readonly workCheckFrequency;
    constructor(taskId: string, fn: TaskFunction, knex: Knex, logger: Logger, workCheckFrequency?: Duration);
    start(settings: TaskSettingsV2, options?: {
        signal?: AbortSignal;
    }): Promise<void>;
    static trigger(knex: Knex, taskId: string): Promise<void>;
    /**
     * Makes a single attempt at running the task to completion, if ready.
     *
     * @returns The outcome of the attempt
     */
    private runOnce;
    /**
     * Perform the initial store of the task info
     */
    persistTask(settings: TaskSettingsV2): Promise<void>;
    /**
     * Check if the task is ready to run
     */
    findReadyTask(): Promise<{
        result: 'not-ready-yet';
    } | {
        result: 'abort';
    } | {
        result: 'ready';
        settings: TaskSettingsV2;
    }>;
    /**
     * Attempts to claim a task that's ready for execution, on this worker's
     * behalf. We should not attempt to perform the work unless the claim really
     * goes through.
     *
     * @param ticket - A globally unique string that changes for each invocation
     * @param settings - The settings of the task to claim
     * @returns True if it was successfully claimed
     */
    tryClaimTask(ticket: string, settings: TaskSettingsV2): Promise<boolean>;
    tryReleaseTask(ticket: string, settings: TaskSettingsV2): Promise<boolean>;
}
