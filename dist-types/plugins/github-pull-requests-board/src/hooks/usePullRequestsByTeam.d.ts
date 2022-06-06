import { PullRequestsColumn } from '../utils/types';
export declare function usePullRequestsByTeam(repositories: string[]): {
    pullRequests: PullRequestsColumn[];
    loading: boolean;
    refreshPullRequests: () => Promise<void>;
};
