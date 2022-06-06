/// <reference types="react" />
import { PullRequestColumnConfig } from './lib/types';
declare type PullRequestsPageProps = {
    projectName?: string;
    pollingInterval?: number;
    defaultColumnConfigs?: PullRequestColumnConfig[];
};
export declare const PullRequestsPage: ({ projectName, pollingInterval, defaultColumnConfigs, }: PullRequestsPageProps) => JSX.Element;
export {};
