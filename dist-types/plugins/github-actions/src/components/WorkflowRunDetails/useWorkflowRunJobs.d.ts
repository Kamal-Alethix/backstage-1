export declare const useWorkflowRunJobs: ({ hostname, owner, repo, }: {
    hostname?: string | undefined;
    owner: string;
    repo: string;
}) => import("react-use/lib/useAsyncFn").AsyncState<{
    total_count: number;
    jobs: {
        id: number;
        run_id: number;
        run_url: string;
        node_id: string;
        head_sha: string;
        url: string;
        html_url: string;
        status: "completed" | "queued" | "in_progress";
        conclusion: string;
        started_at: string;
        completed_at: string;
        name: string;
        steps: {
            status: "completed" | "queued" | "in_progress";
            conclusion: string;
            name: string;
            number: number;
            started_at: string;
            completed_at: string;
        }[];
        check_run_url: string;
    }[];
}>;
