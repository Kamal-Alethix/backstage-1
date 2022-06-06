/// <reference types="react" />
import { Entity } from '@backstage/catalog-model';
/**
 * A component for Run Logs visualization.
 */
export declare const WorkflowRunLogs: ({ entity, runId, inProgress, }: {
    entity: Entity;
    runId: number;
    inProgress: boolean;
}) => JSX.Element;
