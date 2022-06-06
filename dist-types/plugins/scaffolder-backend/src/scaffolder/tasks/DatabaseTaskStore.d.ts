import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { SerializedTaskEvent, SerializedTask, TaskStatus, TaskEventType, TaskStore, TaskStoreEmitOptions, TaskStoreListEventsOptions, TaskStoreCreateTaskOptions, TaskStoreCreateTaskResult } from './types';
export declare type RawDbTaskRow = {
    id: string;
    spec: string;
    status: TaskStatus;
    last_heartbeat_at?: string;
    created_at: string;
    created_by: string | null;
    secrets?: string | null;
};
export declare type RawDbTaskEventRow = {
    id: number;
    task_id: string;
    body: string;
    event_type: TaskEventType;
    created_at: string;
};
/**
 * DatabaseTaskStore
 *
 * @public
 */
export declare type DatabaseTaskStoreOptions = {
    database: Knex;
};
/**
 * DatabaseTaskStore
 *
 * @public
 */
export declare class DatabaseTaskStore implements TaskStore {
    private readonly db;
    static create(options: DatabaseTaskStoreOptions): Promise<DatabaseTaskStore>;
    private constructor();
    list(options: {
        createdBy?: string;
    }): Promise<{
        tasks: SerializedTask[];
    }>;
    getTask(taskId: string): Promise<SerializedTask>;
    createTask(options: TaskStoreCreateTaskOptions): Promise<TaskStoreCreateTaskResult>;
    claimTask(): Promise<SerializedTask | undefined>;
    heartbeatTask(taskId: string): Promise<void>;
    listStaleTasks({ timeoutS }: {
        timeoutS: number;
    }): Promise<{
        tasks: {
            taskId: string;
        }[];
    }>;
    completeTask({ taskId, status, eventBody, }: {
        taskId: string;
        status: TaskStatus;
        eventBody: JsonObject;
    }): Promise<void>;
    emitLogEvent(options: TaskStoreEmitOptions<{
        message: string;
    } & JsonObject>): Promise<void>;
    listEvents({ taskId, after, }: TaskStoreListEventsOptions): Promise<{
        events: SerializedTaskEvent[];
    }>;
}
