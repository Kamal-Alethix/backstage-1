import { PullRequest, PullRequestStatus } from '@backstage/plugin-azure-devops-common';
import { Entity } from '@backstage/catalog-model';
export declare function usePullRequests(entity: Entity, defaultLimit?: number, requestedStatus?: PullRequestStatus): {
    items?: PullRequest[];
    loading: boolean;
    error?: Error;
};
