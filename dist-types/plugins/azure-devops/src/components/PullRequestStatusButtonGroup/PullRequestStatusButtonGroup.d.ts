/// <reference types="react" />
import { PullRequestStatus } from '@backstage/plugin-azure-devops-common';
export declare const PullRequestStatusButtonGroup: ({ status, setStatus, }: {
    status: PullRequestStatus;
    setStatus: (pullRequestStatus: PullRequestStatus) => void;
}) => JSX.Element;
