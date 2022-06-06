import { ScmIntegrations } from '@backstage/integration';
import { TaskContext, WorkflowResponse, WorkflowRunner } from './types';
import * as winston from 'winston';
import { TemplateActionRegistry } from '../actions';
import { TemplateFilter } from '../../lib/templating/SecureTemplater';
declare type NunjucksWorkflowRunnerOptions = {
    workingDirectory: string;
    actionRegistry: TemplateActionRegistry;
    integrations: ScmIntegrations;
    logger: winston.Logger;
    additionalTemplateFilters?: Record<string, TemplateFilter>;
};
export declare class NunjucksWorkflowRunner implements WorkflowRunner {
    private readonly options;
    constructor(options: NunjucksWorkflowRunnerOptions);
    private isSingleTemplateString;
    private render;
    execute(task: TaskContext): Promise<WorkflowResponse>;
}
export {};
