/// <reference types="react" />
import { Reviewer } from '@backstage/plugin-azure-devops-common';
declare type PullRequestCardReviewersProps = {
    reviewers: Reviewer[];
};
export declare const PullRequestCardReviewers: ({ reviewers, }: PullRequestCardReviewersProps) => JSX.Element;
export {};
