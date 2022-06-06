import { Knex } from 'knex';
import { Logger } from 'winston';
import { PluginTaskScheduler, TaskInvocationDefinition, TaskRunner, TaskScheduleDefinition } from './types';
/**
 * Implements the actual task management.
 */
export declare class PluginTaskSchedulerImpl implements PluginTaskScheduler {
    private readonly databaseFactory;
    private readonly logger;
    private readonly localTasksById;
    constructor(databaseFactory: () => Promise<Knex>, logger: Logger);
    triggerTask(id: string): Promise<void>;
    scheduleTask(task: TaskScheduleDefinition & TaskInvocationDefinition): Promise<void>;
    createScheduledTaskRunner(schedule: TaskScheduleDefinition): TaskRunner;
}
export declare function parseDuration(frequency: TaskScheduleDefinition['frequency']): string;
