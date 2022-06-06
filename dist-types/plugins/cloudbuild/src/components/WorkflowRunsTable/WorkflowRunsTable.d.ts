/// <reference types="react" />
import { WorkflowRun } from '../useWorkflowRuns';
import { Entity } from '@backstage/catalog-model';
declare type Props = {
    loading: boolean;
    retry: () => void;
    runs?: WorkflowRun[];
    projectName: string;
    page: number;
    onChangePage: (page: number) => void;
    total: number;
    pageSize: number;
    onChangePageSize: (pageSize: number) => void;
};
export declare const WorkflowRunsTableView: ({ projectName, loading, pageSize, page, retry, runs, onChangePage, onChangePageSize, total, }: Props) => JSX.Element;
export declare const WorkflowRunsTable: ({ entity }: {
    entity: Entity;
}) => JSX.Element;
export {};
