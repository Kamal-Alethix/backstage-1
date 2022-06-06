import { Logger } from 'winston';
import { TaskFunction, TaskRunner } from '@backstage/backend-tasks';
/**
 * ScheduleTaskParameters
 * @public
 */
export declare type ScheduleTaskParameters = {
    id: string;
    task: TaskFunction;
    scheduledRunner: TaskRunner;
};
/**
 * Scheduler responsible for all search tasks.
 * @public
 */
export declare class Scheduler {
    private logger;
    private schedule;
    private abortController;
    private isRunning;
    constructor({ logger }: {
        logger: Logger;
    });
    /**
     * Adds each task and interval to the schedule.
     * When running the tasks, the scheduler waits at least for the time specified
     * in the interval once the task was completed, before running it again.
     */
    addToSchedule({ id, task, scheduledRunner }: ScheduleTaskParameters): void;
    /**
     * Starts the scheduling process for each task
     */
    start(): void;
    /**
     * Stop all scheduled tasks.
     */
    stop(): void;
}
