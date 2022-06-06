export declare type Step = {
    name: string;
    status: string;
    conclusion?: string;
    number: number;
    started_at: string;
    completed_at: string;
};
export declare type Job = {
    html_url: string;
    status: string;
    conclusion: string;
    started_at: string;
    completed_at: string;
    id: number;
    name: string;
    steps: Step[];
};
export declare type Jobs = {
    total_count: number;
    jobs: Job[];
};
export declare enum BuildStatus {
    'success' = 0,
    'failure' = 1,
    'pending' = 2,
    'running' = 3
}
