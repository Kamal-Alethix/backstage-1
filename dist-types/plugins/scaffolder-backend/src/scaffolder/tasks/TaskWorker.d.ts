import { TaskContext, TaskBroker, WorkflowRunner } from './types';
import { Logger } from 'winston';
import { TemplateActionRegistry } from '../actions';
import { ScmIntegrations } from '@backstage/integration';
import { TemplateFilter } from '../../lib/templating/SecureTemplater';
/**
 * TaskWorkerOptions
 *
 * @public
 */
export declare type TaskWorkerOptions = {
    taskBroker: TaskBroker;
    runners: {
        workflowRunner: WorkflowRunner;
    };
};
/**
 * CreateWorkerOptions
 *
 * @public
 */
export declare type CreateWorkerOptions = {
    taskBroker: TaskBroker;
    actionRegistry: TemplateActionRegistry;
    integrations: ScmIntegrations;
    workingDirectory: string;
    logger: Logger;
    additionalTemplateFilters?: Record<string, TemplateFilter>;
};
/**
 * TaskWorker
 *
 * @public
 */
export declare class TaskWorker {
    private readonly options;
    private constructor();
    static create(options: CreateWorkerOptions): Promise<TaskWorker>;
    start(): void;
    runOneTask(task: TaskContext): Promise<void>;
}
