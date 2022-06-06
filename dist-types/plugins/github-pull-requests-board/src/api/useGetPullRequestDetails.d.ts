import { PullRequest } from '../utils/types';
export declare const useGetPullRequestDetails: () => (repo: string, number: number) => Promise<PullRequest>;
