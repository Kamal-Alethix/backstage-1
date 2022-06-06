/// <reference types="react" />
import { Policy } from '@backstage/plugin-azure-devops-common';
declare type PullRequestCardProps = {
    policies: Policy[];
    className: string;
};
export declare const PullRequestCardPolicies: ({ policies, className, }: PullRequestCardProps) => JSX.Element;
export {};
