import { JsonObject, Observable } from '@backstage/types';
import { TaskSpec } from '@backstage/plugin-scaffolder-common';
import { Logger } from 'winston';
import { TaskCompletionState, TaskContext, TaskSecrets, TaskStore, TaskBroker, SerializedTaskEvent, SerializedTask } from './types';
import { TaskBrokerDispatchOptions } from '.';
/**
 * TaskManager
 *
 * @public
 */
export declare class TaskManager implements TaskContext {
    private readonly task;
    private readonly storage;
    private readonly logger;
    private isDone;
    private heartbeatTimeoutId?;
    static create(task: CurrentClaimedTask, storage: TaskStore, logger: Logger): TaskManager;
    private constructor();
    get spec(): import("@backstage/plugin-scaffolder-common").TaskSpecV1beta3;
    get secrets(): TaskSecrets | undefined;
    get createdBy(): string | undefined;
    getWorkspaceName(): Promise<string>;
    get done(): boolean;
    emitLog(message: string, logMetadata?: JsonObject): Promise<void>;
    complete(result: TaskCompletionState, metadata?: JsonObject): Promise<void>;
    private startTimeout;
}
/**
 * Stores the state of the current claimed task passed to the TaskContext
 *
 * @public
 */
export interface CurrentClaimedTask {
    /**
     * The TaskSpec of the current claimed task.
     */
    spec: TaskSpec;
    /**
     * The uuid of the current claimed task.
     */
    taskId: string;
    /**
     * The secrets that are stored with the task.
     */
    secrets?: TaskSecrets;
    /**
     * The creator of the task.
     */
    createdBy?: string;
}
export declare class StorageTaskBroker implements TaskBroker {
    private readonly storage;
    private readonly logger;
    constructor(storage: TaskStore, logger: Logger);
    list(options?: {
        createdBy?: string;
    }): Promise<{
        tasks: SerializedTask[];
    }>;
    private deferredDispatch;
    /**
     * {@inheritdoc TaskBroker.claim}
     */
    claim(): Promise<TaskContext>;
    /**
     * {@inheritdoc TaskBroker.dispatch}
     */
    dispatch(options: TaskBrokerDispatchOptions): Promise<{
        taskId: string;
    }>;
    /**
     * {@inheritdoc TaskBroker.get}
     */
    get(taskId: string): Promise<SerializedTask>;
    /**
     * {@inheritdoc TaskBroker.event$}
     */
    event$(options: {
        taskId: string;
        after?: number;
    }): Observable<{
        events: SerializedTaskEvent[];
    }>;
    /**
     * {@inheritdoc TaskBroker.vacuumTasks}
     */
    vacuumTasks(options: {
        timeoutS: number;
    }): Promise<void>;
    private waitForDispatch;
    private signalDispatch;
}
