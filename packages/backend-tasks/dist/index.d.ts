import { DatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { Duration } from 'luxon';
import { AbortSignal } from 'node-abort-controller';

/**
 * Human friendly durations object
 * @public
 */
declare type HumanDuration = {
    years?: number;
    months?: number;
    weeks?: number;
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
};
/**
 * A function that can be called as a scheduled task.
 *
 * It may optionally accept an abort signal argument. When the signal triggers,
 * processing should abort and return as quickly as possible.
 *
 * @public
 */
declare type TaskFunction = ((abortSignal: AbortSignal) => void | Promise<void>) | (() => void | Promise<void>);
/**
 * Options that control the scheduling of a task.
 *
 * @public
 */
interface TaskScheduleDefinition {
    /**
     * How often you want the task to run. The system does its best to avoid
     * overlapping invocations.
     *
     * @remarks
     *
     * This is a best effort value; under some circumstances there can be
     * deviations. For example, if the task runtime is longer than the frequency
     * and the timeout has not been given or not been exceeded yet, the next
     * invocation of this task will be delayed until after the previous one
     * finishes.
     *
     * This is a required field.
     */
    frequency: {
        /**
         * A crontab style string.
         *
         * @remarks
         *
         * Overview:
         *
         * ```
         *   ┌────────────── second (optional)
         *   │ ┌──────────── minute
         *   │ │ ┌────────── hour
         *   │ │ │ ┌──────── day of month
         *   │ │ │ │ ┌────── month
         *   │ │ │ │ │ ┌──── day of week
         *   │ │ │ │ │ │
         *   │ │ │ │ │ │
         *   * * * * * *
         * ```
         */
        cron: string;
    } | Duration | HumanDuration;
    /**
     * The maximum amount of time that a single task invocation can take, before
     * it's considered timed out and gets "released" such that a new invocation
     * is permitted to take place (possibly, then, on a different worker).
     */
    timeout: Duration | HumanDuration;
    /**
     * The amount of time that should pass before the first invocation happens.
     *
     * @remarks
     *
     * This can be useful in cold start scenarios to stagger or delay some heavy
     * compute jobs. If no value is given for this field then the first invocation
     * will happen as soon as possible according to the cadence.
     *
     * NOTE: This is a per-worker delay. If you have a cluster of workers all
     * collaborating on a task that has its `scope` field set to `'global'`, then
     * you may still see the task being processed by other long-lived workers,
     * while any given single worker is in its initial sleep delay time e.g. after
     * a deployment. Therefore this parameter is not useful for "globally" pausing
     * work; its main intended use is for individual machines to get a chance to
     * reach some equilibrium at startup before triggering heavy batch workloads.
     */
    initialDelay?: Duration | HumanDuration;
    /**
     * Sets the scope of concurrency control / locking to apply for invocations of
     * this task.
     *
     * @remarks
     *
     * When the scope is set to the default value `'global'`, the scheduler will
     * attempt to ensure that only one worker machine runs the task at a time,
     * according to the given cadence. This means that as the number of worker
     * hosts increases, the invocation frequency of this task will not go up.
     * Instead the load is spread randomly across hosts. This setting is useful
     * for tasks that access shared resources, for example catalog ingestion tasks
     * where you do not want many machines to repeatedly import the same data and
     * trample over each other.
     *
     * When the scope is set to `'local'`, there is no concurrency control across
     * hosts. Each host runs the task according to the given cadence similarly to
     * `setInterval`, but the runtime ensures that there are no overlapping runs.
     *
     * @defaultValue 'global'
     */
    scope?: 'global' | 'local';
}
/**
 * Options that apply to the invocation of a given task.
 *
 * @public
 */
interface TaskInvocationDefinition {
    /**
     * A unique ID (within the scope of the plugin) for the task.
     */
    id: string;
    /**
     * The actual task function to be invoked regularly.
     */
    fn: TaskFunction;
    /**
     * An abort signal that, when triggered, will stop the recurring execution of
     * the task.
     */
    signal?: AbortSignal;
}
/**
 * A previously prepared task schedule, ready to be invoked.
 *
 * @public
 */
interface TaskRunner {
    /**
     * Takes the schedule and executes an actual task using it.
     *
     * @param task - The actual runtime properties of the task
     */
    run(task: TaskInvocationDefinition): Promise<void>;
}
/**
 * Deals with the scheduling of distributed tasks, for a given plugin.
 *
 * @public
 */
interface PluginTaskScheduler {
    /**
     * Manually triggers a task by ID.
     *
     * If the task doesn't exist, a NotFoundError is thrown. If the task is
     * currently running, a ConflictError is thrown.
     *
     * @param id - The task ID
     */
    triggerTask(id: string): Promise<void>;
    /**
     * Schedules a task function for recurring runs.
     *
     * @remarks
     *
     * The `scope` task field controls whether to use coordinated exclusive
     * invocation across workers, or to just coordinate within the current worker.
     *
     * This convenience method performs both the scheduling and invocation in one
     * go.
     *
     * @param task - The task definition
     */
    scheduleTask(task: TaskScheduleDefinition & TaskInvocationDefinition): Promise<void>;
    /**
     * Creates a scheduled but dormant recurring task, ready to be launched at a
     * later time.
     *
     * @remarks
     *
     * This method is useful for pre-creating a schedule in outer code to be
     * passed into an inner implementation, such that the outer code controls
     * scheduling while inner code controls implementation.
     *
     * @param schedule - The task schedule
     */
    createScheduledTaskRunner(schedule: TaskScheduleDefinition): TaskRunner;
}

/**
 * Deals with the scheduling of distributed tasks.
 *
 * @public
 */
declare class TaskScheduler {
    private readonly databaseManager;
    private readonly logger;
    static fromConfig(config: Config, options?: {
        databaseManager?: DatabaseManager;
        logger?: Logger;
    }): TaskScheduler;
    constructor(databaseManager: DatabaseManager, logger: Logger);
    /**
     * Instantiates a task manager instance for the given plugin.
     *
     * @param pluginId - The unique ID of the plugin, for example "catalog"
     * @returns A {@link PluginTaskScheduler} instance
     */
    forPlugin(pluginId: string): PluginTaskScheduler;
}

export { HumanDuration, PluginTaskScheduler, TaskFunction, TaskInvocationDefinition, TaskRunner, TaskScheduleDefinition, TaskScheduler };
