/// <reference types="react" />
export declare type WorkflowRun = {
    workflowName: string;
    id: string;
    message: string;
    url?: string;
    githubUrl?: string;
    source: {
        branchName: string;
        commit: {
            hash: string;
            url?: string;
        };
    };
    status: string;
    conclusion: string;
    onReRunClick: () => void;
};
export declare function useWorkflowRuns({ hostname, owner, repo, branch, initialPageSize, }: {
    hostname?: string;
    owner: string;
    repo: string;
    branch?: string;
    initialPageSize?: number;
}): readonly [{
    readonly page: number;
    readonly pageSize: number;
    readonly loading: boolean;
    readonly runs: WorkflowRun[] | undefined;
    readonly projectName: `${string}/${string}`;
    readonly total: number;
    readonly error: Error | undefined;
}, {
    readonly runs: WorkflowRun[] | undefined;
    readonly setPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly setPageSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    readonly retry: (() => void) | (() => void) | (() => void) | (() => void);
}];
