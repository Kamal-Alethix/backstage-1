/// <reference types="react" />
import { Substitutions } from '../api/types';
export declare type WorkflowRun = {
    id: string;
    message: string;
    url?: string;
    googleUrl?: string;
    status: string;
    substitutions: Substitutions;
    createTime: string;
    rerun: () => void;
};
export declare function useWorkflowRuns({ projectId }: {
    projectId: string;
}): readonly [{
    readonly page: number;
    readonly pageSize: number;
    readonly loading: boolean;
    readonly runs: WorkflowRun[] | undefined;
    readonly projectName: string;
    readonly total: number;
    readonly error: Error | undefined;
}, {
    readonly runs: WorkflowRun[] | undefined;
    readonly setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly setPageSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
