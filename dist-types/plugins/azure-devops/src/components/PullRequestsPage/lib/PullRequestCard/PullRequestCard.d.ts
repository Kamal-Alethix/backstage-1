/// <reference types="react" />
import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
declare type PullRequestCardProps = {
    pullRequest: DashboardPullRequest;
    simplified?: boolean;
};
export declare const PullRequestCard: ({ pullRequest, simplified, }: PullRequestCardProps) => JSX.Element;
export {};
